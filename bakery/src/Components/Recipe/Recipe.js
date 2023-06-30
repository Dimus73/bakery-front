import './Recipe.css'
import { useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import getAll from '../../Utils/getListFromBase'
import BlockTable from './RecipeTable'

const Recipe = (props) => {
	const user = useSelector (state => state.user);

	const [equipments, setEquipment] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [units, setUnits] = useState([]);
	const [recipe, setRecipe] = useState(
		{
			name : '',
			ingredients:[
				{}
			],
			equipments:[
				{}
			],
			description:'',
			imgURL:''
		}
	)


	const getAllIngredients = async () => {
		const URL = '/api/catalog/ingredients'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		setIngredients(temp.res);
		// console.log(temp.res);
	}

	const getAllEquipment = async () => {
		const URL = '/api/catalog/equipment'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		setEquipment(temp.res);
	}

	const getAllUnits = async () => {
		const URL = '/api/catalog/units'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		setUnits(temp.res);
	}

	useEffect( () => {
		getAllIngredients();
		getAllEquipment();
		getAllUnits();
	} ,[]);


	const saveRecipe = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'

		const reqData = {
			method : 'POST',
			headers : {
				'Content-type' : 'application/json'
			},
			body : JSON.stringify (recipe)
		}
		await fetch (URL, reqData)
	}

	// ---------------------------
	// Callback function for changing the ingredient. It also changes the unit of measure.
	// ---------------------------
	const changeIngredient = ( e, i, flag ) => { 
		e.preventDefault();
		const newValue = Number( e.target.value );
		if (flag === 'I') {
			const newUnits = ingredients.filter((value) => value.id === newValue)[0].unit_short_name
			recipe.ingredients[i].id = newValue;
			recipe.ingredients[i].unit_name = newUnits;
		} else {
			recipe.equipments[i].id = newValue;
		}
		setRecipe({...recipe}); 

	} 

	// ---------------------------
	// Callback function to change quantity of the ingredient
	// ---------------------------
	const changeIngredientQuantity = ( e, i, flag ) => { 
		e.preventDefault();
		
		if ( !isNaN(e.target.value) ){
			// let nd = 'jjj'
			// console.log(isNaN(nd));
			if ( flag === 'I' ){
				recipe.ingredients[i].quantity = e.target.value;
			} else {
				recipe.equipments[i].quantity = e.target.value;
			}
			setRecipe({...recipe}); 
		}

	} 

	// ---------------------------
	// Callback function to remove the ingridient.
	// ---------------------------
	const deleteIngredient = ( e, i, flag ) => { 
		e.preventDefault();
		if ( flag === 'I' ){
			recipe.ingredients = recipe.ingredients.filter((value,ind) => ind !== i);
		} else {
			recipe.equipments = recipe.equipments.filter((value,ind) => ind !== i);
		}
		setRecipe({...recipe}); 
		
	} 


	return(
		<div className='container'>
			<div className='row'>
				<div className='col-3'>
					<label htmlFor="recipe_name">Recipe name:</label>
					<input type="text" name='recipe_name' value={recipe.name}
						onChange={ (e) => {setRecipe ({...recipe, name:e.target.value})}} />
					<label htmlFor="recipe_img">Recipe img:</label>
					<input type="text" name='recipe_img' value={recipe.imgURL}
						onChange={ (e) => {setRecipe ({...recipe, imgURL:e.target.value})}} />
					<div contenteditable="true" 
						onInput={ (e) => {setRecipe ({...recipe, name:e.target.innerText})} }>Test edit div</div>
				</div>
				<div className='col-3'>
					<div>
						<img src={recipe.imgURL} alt="" className='img-thumbnail img-fluid'/>
					</div>
				</div>
				<div className='col-6'>
					<label htmlFor="description">Description</label>
					<textarea name="description" id="" cols="60" rows="8" value={recipe.description}
						onChange={ (e) => {setRecipe ({...recipe, description:e.target.value})} }></textarea>
				</div>
			</div>
			<div className='row'> 
				<div className='col-md-10 col-xl-6'>
					{/* ---------------------------------- */}
					<div>Ingredient</div>
					<BlockTable flag={'I'}
							componentList={recipe.ingredients} recipe={recipe} 
							ingredients={ingredients} changeIngredient={changeIngredient}
							changeIngredientQuantity = {changeIngredientQuantity}
							deleteIngredient = {deleteIngredient} setRecipe={setRecipe}
					/>
					{/* ---------------------------------- */}
				</div>

				<div className='col-md-10 col-xl-6'>
					{/* ---------------------------------- */}
					<div>Equipment</div>
					<BlockTable flag={'E'}
							componentList={recipe.equipments} recipe={recipe} 
							ingredients={equipments} changeIngredient={changeIngredient}
							changeIngredientQuantity = {changeIngredientQuantity}
							deleteIngredient = {deleteIngredient} setRecipe={setRecipe}
					/>
					{/* ---------------------------------- */}
				</div>
				<button onClick={saveRecipe} className=' '>Save recipe</button>
			</div>
		</div>
	)
}



export default Recipe

// https://irecommend.ru/sites/default/files/product-images/1398415/YE2pZJEJ71Mm5dtv3LWPg.jpg
// Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.

// {
//   name: 'Cakce',
//   ingredients: [
//     { id: 1, unit_name: 'pcs', quantity: '3' },
//     { id: 2, unit_name: 'l', quantity: '0.5' },
//     { id: 46, unit_name: 'l', quantity: '2' }
//   ],
//   equipments: [ { id: 4, quantity: '12' }, { id: 2, quantity: '12' } ],
//   description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n' +
//     'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n' +
//     'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos quos in fugiat, voluptas tempore, maiores libero doloribus ad minima quaerat tenetur excepturi blanditiis hic odio esse a mollitia necessitatibus quo.\n',
//   imgURL: 'https://irecommend.ru/sites/default/files/product-images/1398415/YE2pZJEJ71Mm5dtv3LWPg.jpg'
// }