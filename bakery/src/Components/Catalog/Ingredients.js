import { useState, useEffect} from 'react'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'

const URL = 'http://127.0.0.1:3040/api/catalog/';
const URL_Ingredients = 'ingredients';
const URL_Units = 'units';

const Ingredients = () =>{
	const [ingredients, setIngredients] =useState([]);
	const [ingredientsFiltered, setIngredientsFiltered] =useState([]);
	const [units, setUnits] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', unit_id:1});
	const [searchStr, setSearchStr] = useState('');

	const [showModal, setShowModal] = useState(false);

	const getRequest = (URL, toDo) => {
		fetch(URL)
		.then(data => data.json())
		.then(data => toDo(data))
		.catch((err) => {
			alert ('There was a communication error with the server while reading data. Check server operation and try again.')
			console.log('getRequest ERROR:', err);
		})
	}

	
	useEffect(()=>{
		getRequest(URL+URL_Ingredients, setIngredients);
		getRequest (URL+URL_Units, setUnits )	
	}, []);

	useEffect (() =>{
			setIngredientsFiltered (ingredients.filter((value) => 
									searchStr ? value.name.toLowerCase().indexOf( searchStr.toLowerCase() ) !== -1 : true))
	}, [ingredients, searchStr])	

// ----------------------------------------------
// Data validation before saving
// ----------------------------------------------
	const dataValidation = (name, unit_id) => {
		if (!FieldCheck(name)) {
			alert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
		} else if (!name){
			alert ("The Ingredient field cannot be empty")
		} else if (unit_id == 1){
			alert ("Choose a unit of measure")
		}  else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before saving
// ----------------------------------------------
	const nameAddValidation = (name) => {
		if ( ingredients.some ((value) => (value.name.toLowerCase() == name.toLowerCase())) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before update
// ----------------------------------------------
const nameUpdateValidation = (id, name) => {
		if ( ingredients.some ((value) => (value.name.toLowerCase() == name.toLowerCase() && value.id != id)) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Function for adding an ingredient
// ----------------------------------------------
	const addIngredients = (e) =>{
		e.preventDefault();

		const name = e.target.elements.iName.value;
		const unit_id = e.target.elements.iUnit.value;

//Checking data for validity.
		if (dataValidation (name, unit_id) && nameAddValidation (name) ) {
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

			setCurrentItem ({id:'', name:'', unit_id:1});

			fetch (URL+URL_Ingredients, reqData)
			.then (data=> data.json())
			.then (data => {
				setIngredients(data)})
			.catch(err => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log("ERROR when saving data", err)
			})
		}
	}

// ----------------------------------------------
// Function for updating an ingredient
// ----------------------------------------------
	const updateIngredient = (item) => {
		if ( dataValidation(item.name, item.unit_id) && nameUpdateValidation(item.id, item.name) ){
			const reqData = {
				method : 'PUT',
				headers : {
					'Content-type':'application/json'
				},
				body : JSON.stringify ({
					id : item.id,
					name : item.name,
					unit_id : item.unit_id,
					active : item.active
				})
			}

			setCurrentItem ({id:'', name:'', unit_id:1});

			fetch (URL+URL_Ingredients, reqData)
			.then (data => data.json())
			.then (data => setIngredients(data)) 
			.catch((err) => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log('getRequest ERROR:', err);
			})
	
		} else {
			console.log('Not valid. currentItem =>', currentItem);
		}

	}
// ----------------------------------------------
// Function for Cancel update an ingredient
// ----------------------------------------------
	const cancelUpdate = () => {
		setCurrentItem ({id:'', name : '', unit_id : ''})
	}
// ----------------------------------------------
// Push Edit button (update an ingredient)
// ----------------------------------------------
	const pushEditButton = (item) => {
		setCurrentItem ({
			id:item.id, 
			name : item.name, 
			unit_id : item.unit_id,
			active : item.active
		})
	}

	// console.log('ingredientsFiltered =>', ingredientsFiltered);

	const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (e) => {
		e.preventDefault()
    setShowModal(true);
  };


	return (
	<div className='container'>
		<h3 className=''>Catalog | Ingredients</h3	>
		<div className='container '>
			<div className='row justify-content-md-center'>
				<div className='col-6'>
					<form action="">
						<input type="text" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} placeholder='Enter to filter'/>
						<button onClick={(e) => { e.preventDefault(); setSearchStr('') }} >Clear</button>
						<button onClick={handleShowModal}>modal</button>
					</form>
				</div>
			</div>
			<div className='row justify-content-md-center'>
				<div className=' col-8 mt-3 p-3' >
					<div className='scroll_div'>
						<table className='table table-primary'>
							<thead>
								<tr>
									<td>Name</td>
									<td>Unit</td>
									<td>Short unit</td>
									<td></td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{ingredientsFiltered.map((value,i) => <GetIngredient item={value} editButton = {pushEditButton} i={i} updateIngredient = {updateIngredient}/>)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		<div>
		</div >
			<div className='row justify-content-md-center'>
				<div className='form-box col-6 mt-3 p-3'>
					{currentItem.name ?
						<UpdateForm item = {currentItem} units={units} updateIngredient={updateIngredient} cancelUpdate={cancelUpdate} />
						:
						<AddForm item = {currentItem} addIngredients={addIngredients} units={units} />
					}
				</div>
			</div>
		</div>
		<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Модальное окно</Modal.Title>
        </Modal.Header>
        <Modal.Body>Содержимое модального окна</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>

	</div>
	)
}


const GetIngredient = (props) => {
	return(
		<tr key={props.i}>
			<td>{props.item.name}</td>
			<td>{props.item.unit_name}</td>
			<td>{props.item.unit_short_name}</td>
			<td><button onClick={() => props.editButton (props.item)}>Edit</button></td>
			<td><button onClick={() => props.updateIngredient ({...props.item, active:false}) }>Deactivate</button></td>
		</tr>
	)
}


const AddForm = (props) => {
	const [currentItem, setCurrentItem] = useState({})

	useEffect (()=>{
		setCurrentItem({id:props.item.id, 
			name:props.item.name, 
			unit_id:props.item.unit_id})	
	},[props.item])	
		
	return (
		<>
			<div>Add new ingredient:</div>
			<form onSubmit={props.addIngredients} action="">
				<label htmlFor="iName">Ingredient:</label>
				<input onChange={(e) => setCurrentItem ({...currentItem, name:e.target.value}) }
							type="text" name='iName'  value = {currentItem.name}/>
				<label htmlFor="iUnit">Unit:</label>
				<select onChange={(e) => setCurrentItem ({...currentItem, unit_id:e.target.value}) }
							name='iUnit' value = {currentItem.unit_id} >
					{props.units.map ((item) =>
						<option key={item.id} value={item.id}>{item.unit_name}</option>
					)}
				</select>
				<button type='submit'>Add</button>
			</form>
		</>
	)
}

const UpdateForm = (props) => {
	const [currentItem, setCurrentItem] = useState({})

	useEffect (()=>{
		setCurrentItem({
			id : props.item.id, 
			name : props.item.name, 
			unit_id : props.item.unit_id,
			active : props.item.active
		})	
	},[props.item])																								

	return (
	<>
		<div>`Edit ingredient: {props.item.name}` </div>
		<form action="" className='form'>
			<label htmlFor="iName">Ingredient:</label>
			<input onChange={(e) => setCurrentItem ({...currentItem, name:e.target.value}) }
							type="text" name='iName'  value = {currentItem.name}/>
			<label htmlFor="iUnit">Unit:</label>
			<select onChange={(e) => setCurrentItem ({...currentItem, unit_id:e.target.value}) }
							name='iUnit' value = {currentItem.unit_id} >
				{props.units.map ((item) =>
					<option key={item.id} value={item.id}>{item.unit_name}</option>
				)}
			</select>
			<button onClick={(e) => {
				e.preventDefault();
				props.updateIngredient(currentItem);} }>Update</button> 
			<button onClick={(e) => {
				e.preventDefault();
				props.cancelUpdate ();}}>Cancel</button> 
		</form>
	</>
	)
}


	// {/* If the editing mode is then use the "Update" and "Stop" buttons, if the adding mode is the "Add" button */}

	export default Ingredients
