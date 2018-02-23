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