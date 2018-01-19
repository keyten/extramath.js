(function(provider, context){
	if(typeof module === 'object' && typeof module.exports === 'object'){
		module.exports = provider();
	} else if(typeof define === 'function' && define.amd){
		// todo: it will not work
		define('extramath', [], function(){
			return provider();
		});
	} else {
		context.extramath = context.em = provider();
	}
})(function(){
	var extramath = {
		version: '0.0.1'
	};

	return extramath;
}, this);
