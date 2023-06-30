const BlockTable = (props) => {
	return(
		<div className="container h-330" >
			<div className="block-ing table-responsive h-330 bg-success-subtle p-3 border border-2 border-dark" style={{height:'330px'}}>
				<table className="table table-success table-striped table-hover table-sm">
					<thead>
						<tr>
							<th className=''>No.</th>
							<th className=' text-start'>Ingredients</th>
							<th className=' text-end'>{props.flag === 'I' ? 'Quantity' : 'Time'}</th>
							{props.flag ==='I' ? <th className=' text-end'>Units</th> : ""}
							<th className=' text-center'>Action</th>
						</tr>
					</thead>
					<tbody>
						{props.componentList.map((value,i) => <IngredientRow flag={props.flag} value={value} i={i}
							ingredients={props.ingredients} changeIngredient={props.changeIngredient}
							changeIngredientQuantity = {props.changeIngredientQuantity}
							deleteIngredient = {props.deleteIngredient}
						/>)}
					</tbody>
				</table>
			</div>
			<button className='btn btn-primary m-1' onClick={()=>{
					props.componentList.push({});
					props.setRecipe ({...props.recipe});
					}}>Add row</button>
			<button onClick={()=>console.log('Recipe',props.recipe, props.ingredients)}>Print</button>
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
				  onChange={(e) => props.changeIngredient(e, props.i, props.flag)}
					>
					<option disabled selected value=""></option>
					{props.ingredients.map ((value) => <option value={value.id}>{props.flag === 'I' ? value.name : value.equipment}</option>)}
				</select>
			</td>
			<td className='align-middle text-end' >
				<input className="input-box text-right" type="text" value = {props.value.quantity} 
				  onChange={ (e) => { props.changeIngredientQuantity(e, props.i, props.flag) } }
				/>
			</td>
			{props.flag === 'I' ?
				<td className='align-middle text-end' >
				{props.value.unit_name}
			</td> : " "}
			<td className='align-middle text-center' >
				<i class="bi bi-x-square" style={{'font-size': '1.3rem', color: 'cornflowerblue'}}
					onClick={(e) => {props.deleteIngredient (e, props.i, props.flag) }}></i>
			</td>
		</tr>
	)
} 

export default BlockTable
