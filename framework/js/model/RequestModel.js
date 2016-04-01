/*
 * RequestModel: Responsible to contain request data to be sent to the server. 
 * 'defaults' block contains a list of default attributes that needs to be there for a request.
 * 
 */
define([ "frameworkModels/FrameworkModel" ], function(FrameworkModel) {
	return FrameworkModel
			.extend({
				defaults : {
					"language" : "en_us",
					"execution" : "synchronous"
				},
				setRequestID : function(requestID) {
					this.set("requestID", requestID);
				},
				setRequestVersion : function(requestVersion) {
					this.set("version", requestVersion);
				},
				getRequestVersion : function() {
					return this.get("version");
				},
				setOperationalAttributes: function(key, value){
					if(!this.get("operationalAttributes.attributes")) {
						this.set("operationalAttributes.attributes", []);
					}
					this.get("operationalAttributes.attributes").push({"key":key,"value":value});
				},
				getOperationalAttributes: function(){
					return this.get("operationalAttributes.attributes");
				},
				setSchedulable: function(isSchedulable) {
					this.setOperationalAttributes("schedulable", isSchedulable);
				},
				setResponseFileSize: function(responseFileSize) {
					this.setOperationalAttributes("responseFileSize", responseFileSize);
				},
				// Save method is overridden from Backbone to support send
				// redirect from requests
				save : function(key, value, options) {
					var attrs, current;

					// Handle both `("key", value)` and `({key: value})` -style
					// calls.
					if (_.isObject(key) || key == null) {
						attrs = key;
						options = value;
					} else {
						attrs = {};
						attrs[key] = value;
					}
					options = options ? _.clone(options) : {};

					// If we're "wait"-ing to set changed attributes, validate
					// early.
					if (options.wait) {
						if (!this._validate(attrs, options))
							return false;
						current = _.clone(this.attributes);
					}

					// Regular saves `set` attributes before persisting to the
					// server.
					var silentOptions = _.extend({}, options, {
						silent : true
					});
					if (attrs
							&& !this.set(attrs, options.wait ? silentOptions
									: options)) {
						return false;
					}

					// After a successful server-side save, the client is
					// (optionally)
					// updated with the server-side state.
					var model = this;
					var success = options.success;
					options.success = function(resp, status, xhr) {
						var serverAttrs = model.parse(resp, xhr);
						if (options.wait) {
							delete options.wait;
							serverAttrs = _.extend(attrs || {}, serverAttrs);
						}
						if (!model.set(serverAttrs, options))
							return false;
						if (success) {
							success(model, resp);
						} else {
							model.trigger('sync', model, resp, options);
						}
					};

					// Finish configuring and sending the Ajax request.
					var error = options.error;
					options.error = this.wrapError(error, model, options, xhr);

					var method = this.isNew() ? 'create' : 'update';
					var xhr = (this.sync || Backbone.sync).call(this, method,
							this, options);
					if (options.wait)
						this.clear(silentOptions).set(current, silentOptions);
					return xhr;
				},
				wrapError : function(onError, originalModel, options, xhr) {
					return function(xhr, model, resp) {
						resp = model === originalModel ? resp : model;
						if (onError) {
							onError(xhr, originalModel, resp, options);
						} else {
							originalModel.trigger('error', originalModel, resp,
									options);
						}
					};
				}
			});
});
