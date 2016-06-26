import React from 'react';
import ReactDom from 'react-dom';
import '../style/style.scss'
var Editor = React.createClass({
	getInitialState() {
	var detail = JSON.parse(localStorage.recipe);
	detail = detail[this.props.index];
	var tit = detail.title;
	var ingredient =detail.ingredient.join(',');
	    return {
	        title:tit,
	        ing:ingredient,
	    };
	},
	close:function(){
		ReactDom.render(<ShowDetail index={this.props.index}/>,document.getElementById('app'));
	},
	onChangeHandler:function(){
		this.setState({
			title:this.refs.name.value,
			ing:this.refs.ing.value,
		});
		// console.log(this.state.ing);
	},
	update:function(e){
		e.preventDefault();
		var toadd = {'title':this.state.title,'ingredient':this.state.ing.split(',')};
		var recipeList = JSON.parse(localStorage.recipe);
		recipeList.splice(this.props.index, 1,toadd);
		localStorage.recipe = JSON.stringify(recipeList);
		ReactDom.render(<ShowDetail index={this.props.index}/>,document.getElementById('app'));		
	},
	render:function(){
		return (
			<div>
				<h2>Update</h2>
				<form onSubmit={this.update}>
					<label for="name">Name</label>
					<input type="text" ref='name'value={this.state.title} onChange={this.onChangeHandler} required/>
					<label for='ing'>Ingredient</label>
					<input type="text" ref='ing' value={this.state.ing} onChange={this.onChangeHandler} required/>
					<button>Update</button>
				</form>
					<button onClick={this.close}>Close</button>
			</div>
		);
	}
});
var Ingredient = React.createClass({
	render:function(){
		var ingList=this.props.ingList;
		ingList = ingList.map(function(elem,index){
			return(
				<li>
					<span className="no">{index+1}</span>
					<span className="title">{elem}</span>
				</li>
			);
		});
		return(
			<ul>{ingList}</ul>
		);
	}
});
var ShowDetail = React.createClass({
	edit:function(){
		ReactDom.render(<Editor index={this.props.index}/>,document.getElementById('app'));
	},
	close:function(){
		ReactDom.render(<RecipeBox/>,document.getElementById('app'));
	},
	delete:function(){
		var detail=[];
		var index = this.props.index;
		if(typeof(Storage)!==undefined){
			detail = JSON.parse(localStorage.recipe);
			detail.splice(this.props.index,1);
			localStorage.recipe = JSON.stringify(detail);
		}
		ReactDom.render(<RecipeBox/>,document.getElementById('app'));
	},
	render:function(){
		var detail=[];
		var index = this.props.index;
		if(typeof(Storage)!==undefined){
			detail = JSON.parse(localStorage.recipe);
			detail = detail[index];
		}
		return (
			<div>
				<h2>{detail.title}</h2>
				<h3>Ingredient</h3>
				<Ingredient ingList={detail.ingredient}/>
				<button onClick={this.delete}>Delete</button>
				<button onClick={this.edit}>Edit</button>
				<button onClick={this.close}>Close</button>
			</div>
		);
	}
});
var RecipeLister = React.createClass({
	showDetail:function(index){
		ReactDom.render(<ShowDetail index={index}/>,document.getElementById('app'));
	},	
	render:function(){
		var lists;
		if(typeof(Storage)!==undefined){
			if(localStorage.recipe){
				lists = JSON.parse(localStorage.recipe);
				lists = lists.map(function(elem,index) {
					var Click = this.showDetail.bind(this,index);
					return (
						<li onClick={Click} key={index}>
							<span className='no'>{index+1}</span>
							<span className='title'>{elem.title}</span>
						</li>
					);
				}.bind(this));
			}
		}
		return (
			<ul>
				{lists}
			</ul>
		);
	}
});
var AddRecipe = React.createClass({
	getInitialState() {
	    return {
	        title:'',
	        ing:'',
	    };
	},
	close:function(){
		ReactDom.render(<RecipeBox/>,document.getElementById('app'));
	},
	submitHandler:function(e){
		e.preventDefault();
		var title = this.state.title;
		var ing = this.state.ing;
		if(typeof(Storage)!==undefined){
			if(localStorage.recipe){
				var toadd = {'title':title,'ingredient':ing.split(',')};
				var a = JSON.parse(localStorage.recipe);
				a.push(toadd);
				localStorage.recipe = JSON.stringify(a);
			} else {
				var toadd = [{'title':title,'ingredient':ing.split(',')}];
				localStorage.recipe = JSON.stringify(toadd);
			}
		} else {
			alert('Your Browser Does Not Support localStorage')
		}
		this.setState({
			title:'',
			ing:'',
		});
		ReactDom.render(<RecipeBox/>,document.getElementById('app'));
	},
	onChangeHandler:function(){
		this.setState({
			title:this.refs.name.value,
			ing:this.refs.ing.value
		});
	},
	render:function(){
		return (
			<div>
				<h2>Add Recipe</h2>
				<form onSubmit={this.submitHandler}>
					<label for="name">Name</label>
					<input type="text" ref='name' value={this.state.title} onChange={this.onChangeHandler} placeholder='Name' required/>
					<label for="ing">Ingredients</label>
					<input type="text" ref='ing' value={this.state.ing} onChange={this.onChangeHandler} placeholder='Enter Ingredients,Separated By Commas' required/>
					<button>Add Recipe</button>
				</form>	
					<button onClick={this.close}>Close</button>
			</div>
		);
	}
});
var RecipeBox = React.createClass({
	addRecipe:function(){
		ReactDom.render(<AddRecipe/>,document.getElementById('app'));
	},
	render:function(){
		return (
			<div>
				<h1><a href="/">Recipe Box</a></h1>
				<RecipeLister/>
				<button onClick={this.addRecipe}>Add Recipe</button>
				<div id="forkme">
					<a href="https://github.com/AungMyoKyaw/Recipe-Box" target='_blank'><em>Fork me</em></a>
				</div>
			</div>
		);
	}
});

ReactDom.render(<RecipeBox/>,document.getElementById('app'));