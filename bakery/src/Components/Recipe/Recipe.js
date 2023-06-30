import './Recipe.css'
import { useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import getAll from '../../Utils/getListFromBase'

const Recipe = (props) => {
	const user = useSelector (state => state.user);

	const [equipments, setEquipment] = useState([]);
	const [ingredients, setIngredients] = useState([]);
	const [units, setUnits] = useState([]);
	const [recipe, setRecipe] = useState(
		{
			ingredients:[
				{}
			],
			equipments:[],
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

	// ---------------------------
	// Callback function for changing the ingredient. It also changes the unit of measure.
	// ---------------------------
	const changeIngredient = ( e, i ) => { 
		e.preventDefault();
		const newValue = Number( e.target.value );
		const newUnits = ingredients.filter((value) => value.id === newValue)[0].unit_name
		recipe.ingredients[i].id = newValue;
		recipe.ingredients[i].unit_name = newUnits;
		setRecipe({...recipe}); 

	} 

	// ---------------------------
	// Callback function to change quantity
	// ---------------------------
	const changeIngredientQuantity = ( e, i ) => { 
		e.preventDefault();
		
		if ( !isNaN(e.target.value) ){
			// let nd = 'jjj'
			// console.log(isNaN(nd));
			recipe.ingredients[i].quantity = e.target.value;
			setRecipe({...recipe}); 
		}

	} 

	// ---------------------------
	// Callback function to remove the ingridient.
	// ---------------------------
	const deleteIngredient = ( e, i ) => { 
		e.preventDefault();
		recipe.ingredients = recipe.ingredients.filter((value,ind) => ind !== i);
		setRecipe({...recipe}); 
		
	} 


	return(
		<div className='container'>
			<div className='row'> 
				<div className='col-2'>
					<h1>Recipe</h1>
					<select name="ingredient" id="">
						{ingredients.map ((value) => <option value={value.id}>{value.name}</option>)}
					</select>
					<br /><br /><hr />
					<select name="equipment" id="">
						{equipments.map ((value) => <option value={value.id}>{value.equipment}</option>)}
					</select>
					<br /><br /><hr />
					{units.map ((value) => <h4>{value.unit_name}</h4>)}
				</div>
				<div className='col-5'>
					{/* ---------------------------------- */}
					<div>Ingredient</div>
						<div className="block-ing table-responsive h-330 bg-success-subtle p-3 border border-2 border-dark">
							<table className="table table-success table-striped table-hover table-sm">
								<thead>
									<tr>
										<th className=''>No.</th>
										<th className=' text-start'>Ingredients</th>
										<th className=' text-end'>Quantity</th>
										<th className=' text-end'>Units</th>
										<th className=' text-center'>Action</th>
									</tr>
								</thead>
								<tbody>
									{recipe.ingredients.map((value,i) => <IngredientRow value={value} i={i}
										ingredients={ingredients} changeIngredient={changeIngredient}
										changeIngredientQuantity = {changeIngredientQuantity}
										deleteIngredient = {deleteIngredient}
									/>)}
								</tbody>
							</table>
						</div>
						<button className='btn btn-primary m-1' onClick={()=>{
								recipe.ingredients.push({});
								setRecipe ({...recipe});
								}}>Add row</button>
						<button onClick={()=>console.log('Recipe',recipe, ingredients)}>Print</button>
					</div>
					{/* ---------------------------------- */}
			</div>
		</div>
	)
}

const IngredientRow = (props) => {
	// console.log('In IngredientRow', props.value);
	return(
		<tr>
			<td className='align-middle' >{props.i+1}</td>
			<td className='align-middle'>
				<select className="select-box text-start" name="ingredient" id="" value={props.value.id} 
				  onChange={(e) => props.changeIngredient(e,props.i)}
					>
					<option disabled selected value=""></option>
					{props.ingredients.map ((value) => <option value={value.id}>{value.name}</option>)}
				</select>
			</td>
			<td className='align-middle text-end' >
				<input className="input-box text-right" type="text" value = {props.value.quantity} 
				  onChange={ (e) => { props.changeIngredientQuantity(e,props.i) } }
				/>
			</td>
			<td className='align-middle text-end' >
				{props.value.unit_name}
			</td>
			<td className='align-middle text-center' >
				<i class="bi bi-x-square" style={{'font-size': '1.3rem', color: 'cornflowerblue'}}
					onClick={(e) => {props.deleteIngredient (e, props.i) }}></i>
			</td>
		</tr>
	)
} 

export default Recipe

{/* <td>{props.i+1}</td>
<td>
	<select name="ingredient" id="" value={props.value.id}>
		<option disabled selected value=""></option>
		{props.ingredients.map ((value) => <option value={value.id}>{value.name}</option>)}
	</select>
</td>
<td>
	<input type="text" />
</td>
<td>
	{/* {props.ingredients.filter((value) => value.id == props.value)[0].unit_name} */}

