import React, { useState, useEffect } from "react"

const Form = (props) => {
 
    const [notes, setNotes] = useState(null) //this will be state for the notes recveived beneath the form
    const [form, setForm] = useState({ title: "", review: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

 

  const fetchNotes = async () => {
     setIsSubmitting(true)
     const res = await fetch("/notes") //notes there is endpoint of the api
     const data = res.json()
     setIsSubmitting(false) //once we get data back for the server api, set back to false
     
  }
  
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

   const handleSubmit = async (e) => {
     e.preventDefault()
     const errs = validate()

     if(Object.keys(errs).length === 0) {
     
       props.closeFrom(false , form)
       setIsSubmitting(false)
       setForm({ title: "", review: "" })
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
