import { useState, useEffect } from 'react'
import { useSelector  } from 'react-redux'
import { useNavigate  } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';


const emptyTask = {
	taskId : 0,
	recipeId : '',
	recipeName : '',
	quantityInRecipe : 0,
	unit_name : "",
	quantity : '',
	totalQuantity : 0,
	inWork : false,
	isReady : false
}

const EDIT_MODE ={
	CREATE : 'create',
	EDIT : 'edit',
	VIEW : 'view',
}

const CreateTask = () => {

	const [task, setTask] = useState({
		id : 0,
		date : new Date(),
		inWork : false,
		isReady : false
	});

	const [taskList, setTaskList] = useState( [ {...emptyTask} ] );

	const [recipeList, setRecipeList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)

	const user = useSelector ( (state) =>(state.user) )


// ---------------------------
// Function to read the list of available recipes
// ---------------------------

	const getRecipeList = async () => {
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/recipe'

		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			console.log(data, dataJS);
			if (data.ok) {
				setRecipeList (dataJS);
			} else {
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)
		}
	}

	useEffect (() =>{

		const tt = async () => {
			await getRecipeList ();
		}
		tt ();

	},[])

	// ---------------------------
	// Callback function  called when a recipe is selected
	// ---------------------------
	const choseRecipe = (e, i) => {
		const currentId = e.target.value;
		const currentRecipe = recipeList.filter ((value => value.id === Number(currentId)))

		taskList[i].recipeId = currentId;
		taskList[i].recipeName = currentRecipe[0].name;
		taskList[i].unit_name = currentRecipe[0].unit_name; 	
		taskList[i].quantityInRecipe = currentRecipe[0].finish_quantity	
		if (!('id' in taskList[i])){
			taskList[i].id=0;
		}
		if ( taskList.every (value => ('id' in value) ) ){
			taskList.push({...emptyTask});
		}
		setTaskList([...taskList])
	}

	// ---------------------------
	// Callback function called when the quantity to be produced changes
	// ---------------------------
	const changeQuantity = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			taskList[i].quantity = currentQuantity;
			taskList[i].totalQuantity = Number ( currentQuantity ) * Number ( taskList[i].quantityInRecipe )
			setTaskList([...taskList]); 
		}


	}

	return (
		<div className="container">
			{editMode === EDIT_MODE.CREATE ? <h1>CREATE daily task</h1>
			:
			editMode === EDIT_MODE.EDIT ? <h1>EDIT daily task</h1> 
			:
			<h1>VIEW daily task</h1> 
			}
			<label htmlFor="taskDate">Choice the day</label>
			<input type="date" name='taskDate' value={task.date.toISOString().split('T')[0]} />
			<div className='row'>
				<div className='col-6'>
					<div className='container'>
						<div className='row'>
							<div>
								<table className='table table-hover'>
									<thead>
										<tr>
											<th className='col-1'>No</th>
											<th className='col-4'>Recipe</th>
											<th className='col-2'>Quantity in recipe</th>
											<th className='col-1'>Unit</th>
											<th className='col-2 text-end'>Task numbers</th>
											<th className='col-2'>Total</th>
										</tr>
									</thead>
									<tbody>
											{taskList.map ((value,i) => <TaskRow item={value} recipeList = {recipeList} i={i} choseRecipe={choseRecipe} changeQuantity={changeQuantity} />) }
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


const TaskRow = (props) => {
	return (
		<tr key={props.i} >
			<td className="col-1" >{props.i+1}</td>
			<td className="col-4" >
				<select name="recipeId" id="" value={props.item.recipeId} onChange={(e) => props.choseRecipe(e,props.i)} >
					<option value="" disabled selected ></option>
						{props.recipeList.map ( ( value,i ) => 
								<option key={i} value={value.id} >{value.name}</option>)}
				</select>
			</td>
			<td className="col-2" >
				{props.item.quantityInRecipe}
			</td>
			<td className="col-1" >
				{props.item.unit_name}
			</td>
			<td className='col-2'>
				<input  className='text-end w-100' type="text" name="quantity" value={props.item.quantity} onChange={(e) => props.changeQuantity (e, props.i)} /> 
			</td>
			<td className="col-2" >
				{props.item.totalQuantity}
			</td>
		</tr>
	)
}

export default CreateTask