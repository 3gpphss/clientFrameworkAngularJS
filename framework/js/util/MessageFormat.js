/*
 * MessageFormat: Responsible to format the passed message keyword, by reading the proper message from MessageProperties file
 * and replacing the passed parameters to the message.
 */
define(['frameworkPath/util/MessageProperties', 'frameworkPath/util/FrameworkHelper'], function(MessageProperties, FrameworkHelper){
	var MessageFormat = function(messageCode, params) {
		return FrameworkHelper.replaceErrorParams(MessageProperties[messageCode], params);
	}
	return MessageFormat;
});