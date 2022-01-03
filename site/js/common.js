const ECReturnCodes = {
    OPERATION_COMPLETE: 0,
    NO_OPERATION: -4007,
    STILL_WORKING: -4009
};

/**
 * Completes an operation with helpful debugging output regarding state.
 *
 * @param progress {ECProgress}
 * @param callback {Function}
 */
function completeOp(progress, callback) {
    trace("hi! status: " + progress.status + ", operation: " + progress.operation + ", description: " + progress.description + ", phase: " + progress.phase + ", isCancelRequested: " + progress.isCancelRequested + ", downloadedSize: " + progress.downloadedSize + ", totalSize: " + progress.totalSize + ", errCode: " + progress.errCode + ", errInfo: " + progress.errInfo);

    const watchdog = new Watchdog(3000);
    watchdog.complete(callback);
}

/**
 * Watchdog is designed to monitor the gradual progression of an asynchronous EC operation.
 * It operates by comparing state across poll intervals.
 * If it has not made progress for an amount of time, it errors.
 *
 * @param timeout {number} The amount of milliseconds to wait until calling it quits
 * @constructor
 */
function Watchdog(timeout) {
    /**
     * The amount of milliseconds this function should poll throughout until timeout.
     */
    this.pollInterval = 1000;

    // However, we can't listen beneath the minimal poll interval.
    if (this.pollInterval > timeout) {
        error("You can't watch beneath the minimal poll interval, every 1 second.");
    }

    /**
     * Amount of time to sleep in total.
     */
    this.timeout = timeout;

    /**
     * Current amount of time spent without progress.
     */
    var elapsedLackOfProgress = 0;

    /**
     * Cached state of operation.
     */
    var cachedPhase = 0;

    /**
     * Cached download amount.
     */
    var cachedDownloadSize = 0;

    /**
     * Run a Watchdog lifecycle.
     *
     * @param callback {function} What to call on success
     */
    this.complete = function(callback) {
        // Get the foremost operation's progress.
        const progress = ec.getProgress();

        trace("Milliseconds since last accident: " + elapsedLackOfProgress + "\n" +
            "Current status: " + progress.status);

        // See if this has already has a state in some way that isn't STILL_WORKING.
        const status = progress.status;
        if (status < 0 && status !== ECReturnCodes.STILL_WORKING) {
            // Not a whole lot we can do about that..
            error("requested operation to complete came in with status " + status);
            return;
        } else if (status === 0) {
            // We're free!
            callback();
            return;
        }
        // status should never be above zero.
        // Here's hoping no bits flip..

        var didProgress;
        // Progress means one of two states:
        if (progress.totalSize !== 0) {
            // ...one, that we are a download operation with a total size,
            // and our attributed downloaded size is different from before.
            didProgress = (progress.downloadedSize !== cachedDownloadSize);
        } else {
            // ...two, that we are waiting for the proper response of an action
            // and our phase has changed.
            didProgress = (progress.phase !== cachedPhase);
        }

        // If we've progressed, we need to update our cache and reset our failure timer.
        if (didProgress) {
            cachedDownloadSize = progress.downloadedSize;
            cachedPhase = progress.phase;
            elapsedLackOfProgress = 0;
        } else {
            // If we didn't, we need to add this poll to our failure timer.
            elapsedLackOfProgress += this.pollInterval;
        }

        // Check if we've gone over our allocated time.
        if (elapsedLackOfProgress >= this.timeout) {
            error("running operation timed out after " + elapsedLackOfProgress + "ms");
            return;
        }

        // Continue the cycle as we're not completed.
        var currentObject = this;
        setTimeout(function() {
            currentObject.complete(callback);
        }, this.pollInterval);
    };
}

/**
 * Throws a generic error with code 66666.
 *
 * @param reason Reason to throw this error
 */
function error(reason) {
    trace("uh oh! something majorly was messed up: " + reason);
    // shop.error(66666, 2);
}

/**
 * Returns a usable subdomain for the given service type.
 * This is useful for getting domains such as ias, ecs and cas.
 *
 * @param serviceType Name of service to return
 * @return {string} Domain name usable for other usage
 */
function getSubdomain(serviceType) {
    // Get the base domain.
    var baseDomain = window.location.hostname;

    // Strip the first subdomain.
    // We could expect this to be "oss-auth", but it can be anything.
    baseDomain = baseDomain.substring(baseDomain.indexOf('.'));

    return "https://" + serviceType + baseDomain;
}



/**
 *
 * @return {string}
 */
function getECS() {
    return getSubdomain("ecs") + "/ecs/services/ECommerceSOAP";
}

function getIAS() {
    return getSubdomain("ias") + "/ias/services/IdentityAuthenticationSOAP";
}

function getCAS() {
    return getSubdomain("cas") + "/cas/services/CatalogingSOAP";
}

function getCCS() {
    return getSubdomain("ccs");
}

function getUCS() {
    return getSubdomain("ucs");
}

const RegistrationStates = {
    REGISTERED: "R",
    UNREGISTERED: "U"
};

