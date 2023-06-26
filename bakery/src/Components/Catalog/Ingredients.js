import { useState, useEffect} from 'react'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
const URL = 'http://127.0.0.1:3040/api/catalog/';
const URL_Ingredients = 'ingredients';
const URL_Units = 'units';

const Ingredients = () =>{
	const [ingredients, setIngredients] =useState([]);
	const [units, setUnits] =useState([]);

	const getRequest = (URL, toDo) => {
		fetch(URL)
		.then(data => data.json())
		.then(data => toDo(data))
	}

	
	useEffect(()=>{
		getRequest(URL+URL_Ingredients, setIngredients);
		getRequest (URL+URL_Units, setUnits )	
	}, []);

// Checking data for validity.
	const addIngredients = (e) =>{
		e.preventDefault();

		const name = e.target.elements.iName.value;
		const unit_id = e.target.elements.iUnit.value;
//Checking data for validity.
		if (!FieldCheck(name)) {
			alert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
		} else if (!name){
			alert ("The Ingredient field cannot be empty")
		} else if (unit_id == 1){
			alert ("Choose a unit of measure")
		} else if (ingredients.some ((value) => (value.name.toLowerCase() == name.toLowerCase()))){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
// Sending data to the server
			const reqData = {
				method: "POST",
				headers:{
					'Content-type':'application/json'
				},
				body:JSON.stringify({
					name,
					unit_id
				})
			}
			fetch (URL+URL_Ingredients,reqData)
			.then (data=> data.json())
			.then (data => {
				console.log(data);
				setIngredients(data)})
			}
	}

	console.log(ingredients);

	return (
	<div>
		<div className='scroll_div'>
			<h1>Hello</h1>
			<table>
				<thead>
					<tr>
						<td>Name</td>
						<td>Unit</td>
						<td>Short unit</td>
					</tr>
				</thead>
				<tbody>
					{ingredients.map((value) => <GetIngredient item={value}/>)}
				</tbody>
			</table>
		</div>
		<div>
			<div>Add new ingredient:</div>
				<form onSubmit={addIngredients} action="">
					<label htmlFor="iName">Ingredient:</label>
					<input type="text" name='iName' />
					<label htmlFor="iUnit">Unit:</label>
					<select name='iUnit'>
						{units.map ((item) => 
						<option value={item.id}>{item.unit_name}</option>
						)}
						{/* <option value="unit"></option> */}
					</select>
					<button type='submit'>Add</button>
				</form>
		</div>
	</div>
	)
}


const GetIngredient = (props) => {
	return(
		<tr>
			<td>{props.item.name}</td>
			<td>{props.item.unit_name}</td>
			<td>{props.item.unit_short_name}</td>
		</tr>
	)
}

export default Ingredients
