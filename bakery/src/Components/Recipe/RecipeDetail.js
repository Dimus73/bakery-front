
import { useParams } from "react-router-dom";
import {useSelector} from 'react-redux';
import { useState, useEffect } from "react"; 
import Recipe from './Recipe'

const RecipeDetail = (props) => {
	const {id} = useParams(); 
	const user = useSelector(state => state.user);
	const [recipeDetail, setRecipeDetail] = useState ({})

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
			console.log(data, dataJS);
			if (data.ok) {
				setRecipeDetail (dataJS);
			} else {
				alert(`Error getting recipes detail. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			console.log(error);
			alert (`Error getting recipes detail. Message: ${error}`)
		}

	}

	useEffect (() => {
		 getRecipeDetail(id)
	},[])

	// console.log('Recipe detail:', recipeDetail);
	return(
		<div>
			<h1>Recipe detail</h1>
			<Recipe flag={'edit'} recipe={recipeDetail} />
		</div>
	)
}

export default RecipeDetail