extramath.modulesDef = {};
extramath.modules = {};

extramath.declare = function(name, deps, fn){
	if(!fn){
		fn = deps;
		deps = [];
	}

	extramath.modulesDef[name] = {
		name: name,
		deps: deps,
		fn: fn,
		ctx: this
	};
};

extramath.require = function(deps, fn, stack, requiredAsArray){
	var ctx = this;

	if(!Array.isArray(deps)){
		deps = [deps];
	}

	if(!stack){
		stack = [];
	}

	// install deps
	var required = [];
	deps.forEach(function(name){
		if(stack.indexOf(name) > -1){
		//	throw "Circular dependency!";
		}
		stack.push(name);

		if(extramath.modules[name]){
			required.push(extramath.modules[name]);
			if(deps.length === required.length){
				fn.apply(ctx, requiredAsArray ? [required] : required);
			}
			return;
		}

		var def = extramath.modulesDef[name];
		if(def.deps.length){
			extramath.require(def.deps, function(moduleDeps){
				def.fn.apply(ctx, [function(module){
					extramath.modules[name] = module;
					required.push(extramath.modules[name]);
					if(deps.length === required.length){
						fn.apply(ctx, requiredAsArray ? [required] : required);
					}
				}].concat(moduleDeps));
			}, stack.slice(), true);
		} else {
			def.fn.call(ctx, function(module){
				extramath.modules[name] = module;
				required.push(extramath.modules[name]);
				if(deps.length === required.length){
					fn.apply(ctx, requiredAsArray ? [required] : required);
				}
			});
		}

	});
};

extramath.installAt = function(name, object){
	var dest = this;
	var parts = name.split('.');
	parts.slice(0, parts.length - 1).forEach(function(part){
		if(dest[part]){
			dest = dest[part];
		} else {
			dest = dest[part] = {};
		}
	});
	dest[parts[parts.length - 1]] = object;
};

	//provide(function(x){
	//	return null;
	//}, true);

	// example: your require special.gamma
	// provide-true adds obj em.special and then adds there em.special.gamma = providedOb
	// then you require special
	// provide-true does not replace em.special gamma with providedOb deleting the em.special.gamma
	// it extends it!
