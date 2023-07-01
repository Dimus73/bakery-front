
import { useParams } from "react-router-dom";
import {useSelector} from 'react-redux';
import { useState, useEffect } from "react"; 
import getAll from '../../Utils/getListFromBase'
import Recipe from './Recipe'

let a=0;
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
	creator : 1
}
let b=emptyRecipe;


const RecipeDetail = () => {
	const {id} = useParams(); 
	const user = useSelector(state => state.user);
	const [recipeDetail, setRecipeDetail] = useState (emptyRecipe)

	const getRecipeDetail = async (id) => {
		const BASE_URL = process.env.REACT_APP_BASE_URL;
		const URL = BASE_URL + '/api/recipe/'+id;

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
			// console.log(data, dataJS);
			if (data.ok) {
				// console.log('Getting recipe data in recipe detail', dataJS);
				// setRecipeDetail ({...dataJS});
				// a=a+1;
				// b={...dataJS}
				return dataJS
			} else {
				alert(`Error getting recipes detail. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting recipes detail. Message: ${error}`)
		}

	}

	//----------------------
	const Promej = async () =>{
		const res = await getRecipeDetail(id)
		console.log('Promej:', res, recipeDetail);
		b={...res}
		setRecipeDetail({...recipeDetail,...res})
	}
	//----------------------

const testClick = (e) => {
	e.preventDefault();
	console.log('event');
	setRecipeDetail({...recipeDetail, name:recipeDetail.name+'aaa'});
} 

	useEffect (() => {
		 Promej();
	},[])

	useEffect (() => {
		console.log('Call AAA', b);
		setRecipeDetail({...b})
  },[b])

	// console.log('Befor call RECIPE recepiedetail', recipeDetail);
	// console.log('Recipe detail:', recipeDetail);
	// const outInfo = ('name' in recipeDetail ? {...recipeDetail} : {...emptyRecipe})
	return(
		<div>
			<h1>Recipe detail</h1>
			<button onClick={testClick}>test</button>
			<p>{JSON.stringify(recipeDetail)}</p>
			<Recipe flag={'edit'} recipe={{...recipeDetail}} />
		</div>
	)
}

export default RecipeDetail