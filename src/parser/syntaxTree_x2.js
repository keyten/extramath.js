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