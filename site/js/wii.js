// Please do not include this file on the actual shop channel, ever.
// It will do nothing but harm.
// This exists to assist with code completion for common functions.

/**
 * Outputs a trace-level message via the EC logger.
 * @param {string} message Message to trace
 */
function trace(message) {}

/**
 * Represents the wiiShop object type inserted into the engine on any Wii.
 * This object allows various interaction with the channel's runtime.
 * You should instantiate it without any parameters.
 *
 * @constructor
 */
function wiiShop() {
    /**
     * Resets the channel.
     **/
    this.retry = function() {}

    /**
     * Disables the HOME menu.
     */
    this.disableHRP = function() {}

    /**
     * Enables the HOME menu.
     */
    this.enableHRP = function() {}

    /**
     * Returns the localized string for the shop connecting.
     * For the English locale, this is "Connecting. Please wait..."
     * It is mandatory to access this, such as setting its value to an unused variable.
     * This disables an internal timer that causes the error 209601.
     **/
    this.connecting = "";

    /**
    * Throws an error, going to a separate page.
    *
    * @param {number} number Number of the error code to display.
    * @param {number} type Type of error message to display.
    */
    this.error = function(number, type) {
    }
}

/**
 * Represents the wiiKeyboard object type inserted into the engine on any Wii.
 * This object allows using a native keyboard.
 * You should instantiate it without any parameters.
 *
 * @constructor
 */
function wiiKeyboard() {
    /**
     * Brings up a keyboard.
     * @param type {number} Type of keyboard. TODO: Document
     * @param rowLimit {number} Number of rows the user should be able to type.
     * @param isPasswordField {boolean} Whether to treat text entered as a password or not.
     * @param title {string} Content to show as a hint while typing.
     */
    this.call = function(type, rowLimit, isPasswordField, title) {}
}

/**
 * Represents the ECommerceInterface object type inserted into the engine on any Wii.
 * This high-level object allows a great amount of interaction with the underlying EC library.
 * You should instantiate it without any parameters, and only have one per page. Things get hairy otherwise.
 *
 * @constructor
 */
function ECommerceInterface() {
    /**
     * Sets internal engine endpoints.
     * @param {string} easUrl The endpoint used for EAS-related requests.
     */
    this.setWebSvcUrls = function(easUrl) {}
    /**
     * Sets internal engine endpoints.
     * @param {string} easUrl The endpoint used for EAS-related requests.
     * @param {string} iasUrl The endpoint used for IAS-related requests.
     */
    this.setWebSvcUrls = function(easUrl, iasUrl) {}
    /**
     * Sets internal engine endpoints.
     * @param {string} easUrl The endpoint used for EAS-related requests.
     * @param {string} iasUrl The endpoint used for IAS-related requests.
     * @param {string} casUrl This URL is unused. It is unknown what it would do.
     */
    this.setWebSvcUrls = function(easUrl, iasUrl, casUrl) {}

    /**
     * Retrieves the current log.
     *
     * @returns {string}
     */
    this.getLog = function() {}

    /**
     *
     * @returns {ECProgress}
     */
    this.sendChallengeReq = function() {}

    /**
    *
    * @returns {string}
    */
    this.getChallengeResp = function() {}

    /**
    *
    * @returns {ECProgress}
    */
    this.getProgress = function() {}
}

/**
 * Represents the progress of an asynchronous operation performed by EC.
 * This should not be instantiated by itself.
 *
 * @constructor
 */
function ECProgress() {
    /**
     * Status returned by EC internally.
     * -4009 appears to mean "incomplete".
     */
    this.status = 0
    /**
     * Operation title.
     */
    this.operation = ""
    /**
     * Operation description.
     */
    this.description = ""
    /**
     * Unknown.
     */
    this.phase = 0
    /**
     * State of cancellation.
     */
    this.isCancelRequested = false
    /**
     * Size currently downloaded. Most useful for a title contents-related operation, 0 otherwise.
     */
    this.downloadedSize = 0
    /**
     * Size of the finished contents. Most useful for a title contents-related operation, 0 otherwise.
     */
    this.totalSize = 0
    /**
     * Error code returned from operation.
     */
    this.errCode = 0
    /**
     * Information about the error. TODO: find how this is set
     */
    this.errInfo = ""

}