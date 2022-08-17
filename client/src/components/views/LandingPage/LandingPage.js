import React, {useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

  const navigate = useNavigate();

  useEffect(() => {
      axios.get('/api/hello')
      .then(response => console.log(response.data));
  }, [])

  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response => {

      if(response.data.success) {
        navigate("/login");
      } else {
        alert('logout Failed')
      }

      console.log(response.data);
    })
  }

  return (
    <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center'
                , width : '100%', height : '100vh'}}>
      <h2>LandingPage</h2>

      <button onClick={onClickHandler}> logout </button>
    </div>
  )
}

export default LandingPage