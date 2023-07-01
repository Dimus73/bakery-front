import { useSelector  } from "react-redux";
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom";

const RecipeList = () =>{
	const user = useSelector (state => state.user)
	const [recipeList, setRecipeList] = useState([]);

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

	useEffect (() => {
		getRecipeList()
	},[]);

	// console.log('recipeList', recipeList);

	return (
		<div>
			<h1>Recipe list</h1>
			<ul>
				{recipeList.map((value) => {
					return (<li>
						<Link to={"/recipe/"+value.id} >{value.name}</Link>
					</li>)
				})}
			</ul>
		</div>
	)
}

export default RecipeList