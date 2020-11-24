//in the tutorial I'm watching on Forms he does only a form and he submits data also
//but he has this json-server installed and when he submits data in the form
//it gets submitted to this json-server api - json-server api is an npm package
//which essentially gives us a fake api to allow us get, post, delete and update data
//so that's what he's using to handle data submitted to the Form
//and when that data in the Form gets submitted to the json-server api
//he also has a method to fetch that data and display it on the page beneath the Form
//I have the json-server installed for this app & added the relevant entries
//to the package.json file but I haven't run: npm run dev
//that command runs both the json-server and the react app
//when you run that it creates a database -db.json  - in your react directory
//with some dummy data
//he renames the array in the db.json to 'notes' so notes is the API endpoint
//APIs work using 'requests' and 'responses. ' When an API requests information
//from a web application or web server, it will receive a response.
//The place that APIs send requests and where the resource lives, is called an endpoint.
//so now he goes to http://localhost:3000/notes and he'll get back the data
//in the notes array in the db.json

 import React, { useState, useEffect } from "react"

const Form = (props) => {


     //useEffect below so when the component mounts or it re-renders
  //we'll fetch the data from the json-server.api
  //so we'll add a dependancy there and when the component mounts
  //we want to make sure we fetch the data

//    useEffect(() => {
//     fetchNotes();

//  }, [])
 
    const [notes, setNotes] = useState(null) //this will be state for the notes recveived beneath the form
    const [form, setForm] = useState({ title: "", review: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

 

  const fetchNotes = async () => {
     setIsSubmitting(true)
     const res = await fetch("/notes") //notes there is endpoint of the api
     const data = res.json()
     setIsSubmitting(false) //once we get data back for the server api, set back to false
     //setNotes(data)
  }
  


 // fetchNotes();
 //method to handle the user inputing values into our Form so we can update the form accordingly
 //the 'name' below is the name given to the form field in the html & we grab the value from there
 // object desctructure 
   const handleChange = (e) => {
      
     
       if (e.name == "title"){
        setForm(state => {
          return {
            ...state,
            title: e.value
          };
        }
          )
       }else{
        setForm(state => {
          return {
            ...state,
            review: e.value
          };
        })
       }
    //  setForm({
    //      ...form,
    //      e.target.name : e.target.value
    //  })
   }

   const validate = () => {
      let err = {}

      if(!form.title){ //if the Name field is empty
          err.title = "Name is required"
      }

       if(!form.review){ //if the Review field is empty
          err.review = "review  is required"
      }

      return err
   }

   const showError = (errorOb) => {
       let errMsg = ""

       for(let err in errorOb){
         errMsg += `${errorOb[err]}. `
       }

       alert(`Errors ${errMsg}`)
   }

   //method to handle the posting of the form, the data being submitted in the Form

   const postNotes = async (data) => {
       
      await fetch("/notes", {
         method: "POST",
         headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
      })

   }
// const afterSubmit = (event) =>{
//   let hidden = false 
//   props.closeFrom(hidden)

// }
   const handleSubmit = async (e) => {
     e.preventDefault()
     const errs = validate()

     if(Object.keys(errs).length === 0) {
       //setIsSubmitting(true)
       //await postNotes(form) not used
       //console.log(form) 
       props.closeFrom(false , form)
       setIsSubmitting(false)
       setForm({ title: "", review: "" })
       //fetchNotes()
     }else {
       showError(errs)
     }

}

return(
    <div className="Form">
      <div className="container" style={{width: 400, marginTop: 20}}>
        <form action="" onSubmit={handleSubmit}>
         <fieldset>
           <div className="form-group">
             <label htmlFor="exTitle">Restaurant Name</label>
               <input
                    type="text"
                    className="form-control"
                    id="exTitle"
                    name="title"
                    value={form.title}
                    placeholder="Restaurtant Name"
                    onChange={(event)=>handleChange(event.target)}
               />
            </div>
           <div className="form-group">
             <label htmlFor="exampleTextarea">Write Your Review</label>
               <textarea
                    className="form-control"
                    id="exampleTextarea"
                    rows="3"
                    name="review"
                    value={form.review}
                    onChange={(event)=>handleChange(event.target)}
             ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </fieldset>
     </form>
     <div style={{width: 400, marginTop: 20}}>
     
     </div>
  </div> 
  </div>
  )
}


export default Form;
