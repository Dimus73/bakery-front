import './Recipe.css'
import { useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import getAll from '../../Utils/getListFromBase'
import BlockTable from './RecipeTable'

const Recipe = (props) => {

	const user = useSelector (state => state.user);
	const emptyRecipe = {
		name : '',
		finish_quantity : 1,
		unit_id : '',
		semifinished : false,
		ingredients:[
			{}
		],
		equipments:[
			{}
		],
		description:'',
		imgURL:'',
		creator : user.userId
	}

	const [equipments, setEquipment] = useState(
		[{
			id: '', equipment: '', quantity: '', active: ''
		}]
	);
	const [ingredients, setIngredients] = useState(
		[{
			id: '', name: '', unit_id: '', unit_name: '', unit_short_name: ''
		}]
	);
	const [units, setUnits] = useState(
		[{
			id: '', unit_name: '', unit_short_name: ''
		}]
	);
	const [recipe, setRecipe] = useState( emptyRecipe )

	let i =[];
	let e =[];
	let u= [];

	const getAllIngredients = async () => {
		const URL = '/api/catalog/ingredients'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		i=[...temp.res]
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
		e=[...temp.res]
		setEquipment(temp.res);
	}

	const getAllUnits = async () => {
		const URL = '/api/catalog/units'
		const temp = await getAll(user.token, URL);
  
		if (!temp.ok) {
			alert (temp.res)
			return ;
		}
		u=[...temp.res]
		setUnits(temp.res);
	}

	useEffect( () => {
		const tt = async () => {
			await getAllIngredients();
			await getAllEquipment();
			await getAllUnits();
			console.log('After async:', units, equipments, ingredients);
			console.log('After async ppppp:', u, e, i);
			// if ('flag' in props && units.length>1 && equipments.length > 1 && ingredients.length > 1) {
			// 	setRecipe( props.recipe )
			// }
			setRecipe( props.recipe )
		}
	 	tt()
	} ,[]);
	

	// useEffect( () => {
	// 	const tt = async () => {
	// 		await getAllIngredients();
	// 		await getAllEquipment();
	// 		await getAllUnits();
	// 		if ('flag' in props) {
	// 			setRecipe( props.recipe )
	// 		}
	// 	}
	//  	tt()
	// } ,[]);


	// ---------------------------
	// Checking data before sending it to the server
	// ---------------------------

	const recipeDataCheck = (data) => {
		if (!(data.name.trim())) {
			alert ('Recipe name field cannot be empty');
			return false
		}
		if (isNaN(data.finish_quantity)){
			alert ('You must specify the amount of output')
			return false
		}
		if (data.unit_id == 1){
			alert('It is necessary to select units of finished products')
			return false
		}
		if (data.ingredients.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the "number of ingredients" field must be a number greater than zero')
			return false;
		}
		if (data.equipments.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the "equipment time" field must be a number greater than zero')
			return false;
		}
		return true
	}

	// ---------------------------
	// Clearing data before sending it to the server
	// ---------------------------
	const clearData = (recipe) => {
		const data = {...recipe};

		data.ingredients = data.ingredients.filter((value) => 'id' in value)
		data.equipments = data.equipments.filter((value) => 'id' in value)
		data.name = data.name.trim();

		return data

	}


	// ---------------------------
	// Function to save data to database
	// ---------------------------
	const saveRecipe = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'
		// recipe.creator = user.id;

		const data = clearData(recipe);

		if (!recipeDataCheck(data)) { 
			return
		}

		console.log('Recipe from FRONT =>', data, user);

		const reqData = {
			method : 'POST',
			headers : {
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token 
			},
			body : JSON.stringify (data)
		}
		// await fetch (URL, reqData)
		try {
			await fetch (URL, reqData)	
		} catch (error) {
			console.log(`Error while saving recipe. Message: ${error}`);
			alert (`Error while saving recipe. Message: ${error}`)
		}
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
			if ( recipe.ingredients.filter((value) => !('id' in value)) ){
				recipe.ingredients.push({})
			}
		} else {
			recipe.equipments[i].id = newValue;
			if ( recipe.equipments.filter((value) => !('id' in value)) ){
				recipe.equipments.push({})
			}

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

					<label htmlFor="finish_quantity">Finish quantity:</label>
					<input className='w-30' type="text" name='finish_quantity' value={recipe.finish_quantity}
							onChange={ (e) => {setRecipe ({...recipe, finish_quantity:e.target.value})}} />

					<label htmlFor="iUnit">Unit:</label>
					<select onChange={(e) => setRecipe ({...recipe, unit_id:e.target.value}) }
							name='unit' value = {recipe.unit_id} >
						{units.map ((item) =>
							<option key={item.id} value={item.id}>{item.unit_name}</option>
						)}
					</select>
					<label htmlFor="is_semifinished">Semifinished</label>
					<input type="checkbox" name="is_semifinished" value={recipe.semifinished} 
					  onChange={ (e) => setRecipe ({...recipe, semifinished:e.target.value}) }/>

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
// https://sun9-41.userapi.com/MI4rjKbAP9M05tzE4GXjGLq9d0wd2_agznLc2w/1pbkJLtMnbU.jpg
// http://klublady.ru/uploads/posts/2022-02/1645019230_14-klublady-ru-p-tort-zakher-foto-15.jpg
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