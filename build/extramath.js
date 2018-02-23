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

extramath.factorial = function(n) {
  // blah
};

// blah
/* extramath.declare('em.syntaxTree', function(provide){

	function Node(type, value, children){
		this.type = type;
		this.value = value;
		this.children = children || [];
	}

	Node.prototype.toString = function(level){
		if(!level){
			level = 0;
		}

		var offset = new Array(level+1).join(' '),
			str = offset + this.value + ' [' + this.type + ']\n';
		return str + this.children.map(function(v){
			return v.toString(level+1);
		}).join('');
	};

	var operators = ['+', '-', '*', '/'];

	provide({
		syntaxTree: function(expression){
			// разбиваем на токены
			var tokens = [];
			var word = '';
			var token;

			for(var i = 0; i < expression.length; i++){
				if(operators.indexOf(expression[i]) > -1){
					token = {
						type: 'operator',
						value: expression[i]
					};
				} else if(expression[i] === '('){
					token = {
						type: 'leftb'
					};
				} else if(expression[i] === ')'){
					token = {
						type: 'rightb'
					};
				} else {
					word += expression[i];
					token = {
						type: 'word'
					};
				}

				if(token.type !== 'word'){
					if(word !== ''){
						tokens.push({
							type: 'word',
							value: word
						});
						word = '';
					}
					tokens.push(token);
				}
			}

			if(word !== ''){
				tokens.push({
					type: 'word',
					value: word
				})
			}

			// создаём
			var currentNode = new Node('Root');
			currentNode.parent = null;

			tokens.forEach(function(token){
				if(token.type === 'operator'){
					currentNode.value = token.value;
				} else if(token.type === 'leftb'){
					var parent = currentNode;
					currentNode.children.push(currentNode = new Node());
					currentNode.parent = parent;
				} else if(token.type === 'rightb'){
					if(!currentNode.parent){
						currentNode.parent = new Node();
						currentNode.parent.children.push(currentNode);
					}
					currentNode = currentNode.parent;
				} else if(token.type === 'word') {
					currentNode.value = token.value;
					if(!currentNode.parent){
						currentNode.parent = new Node();
						currentNode.parent.children.push(currentNode);
					}
					currentNode = currentNode.parent;
				}
			});

			return currentNode;
		}
	});

}); */
// blah
extramath.declare('em.syntaxTree', function(provide){

	function Node(type, value, children){
		this.type = type;
		this.value = value;
		this.children = children || [];
	}

	Node.prototype.toString = function(level){
		if(!level){
			level = 0;
		}

		var offset = new Array(level+1).join(' '),
			str = offset + this.value + ' [' + this.type + ']\n';
		return str + this.children.map(function(v){
			return v.toString(level+1);
		}).join('');
	};

	var operators = [
		['+', '-'],
		['*', '/']
	];

	function operatorTree(sentence, level){
		var letter,
			word = '';
		for(var i = 0; i < sentence.length; i++){

			letter = sentence[i];

			if(operators[level].indexOf(letter) > -1){
				return new Node('Operator', letter, [operatorTree(word, level), operatorTree(sentence.substr(i+1), 0)]);
			}

			word += letter;

		}

		if(level == operators.length - 1){
			return new Node('Word', word);
		} else {
			return operatorTree(word, level + 1);
		}
	}

	// строит скобочное дерево
	function braceTree(sentence, level){
		var letter,
			word = '',
			globalWord = '',
			children = [],
			braceIndex = 0;

		for(var i = 0; i < sentence.length; i++){
			letter = sentence[i];

			if(braceIndex === 0){
				if(letter === '('){
					word = '';
					braceIndex++;
					globalWord += ('@' + (level + 1) + '(' + children.length + ')');
				} else if(letter === ')'){
					return new Error('Parsing error');
				} else {
					globalWord += letter;
				}
			} else {
				if(letter === '('){
					braceIndex++;
				} else if(letter === ')'){
					braceIndex--;
				}

				if(braceIndex > 0){
					word += letter;
				} else {
					children.push(word);
				}
			}
		}

		return [globalWord, children.map(function(child){
			if(child.indexOf('(') > -1){
				return braceTree(child, level + 1);
			}
			return child;
		})];
	}

	function syntaxTree(sentence, level){
		if(!level){
			level = 0;
		}

		if(sentence.indexOf('(') === -1){
			return operatorTree(sentence, level);
		}


		function getNode(tree){
			var node = operatorTree(tree[0], 0);
			node.children = node.children.map(function(child){
				if(child.type === 'Word'){
					return ;
				}
			});
			return node;
		}

		var tree = braceTree(sentence, level);
		console.log(tree);

		var node = getNode(tree);
		return node;
	}

	provide({
		braceTree: braceTree,
		operatorTree: operatorTree,
		syntaxTree: syntaxTree
	});

});