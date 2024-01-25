const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			
			currentUser:null,
			token: null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			registerUser: async (email, password) => {
				console.log(email, password)
				try {
					let response = await fetch(`${process.env.BACKEND_URL}/signup`, {
						method: "POST",
						headers: {
							"Content-type": "application/json"
						},
						body: JSON.stringify({email:email, password:password})
					})

					const data = await response.json()
					console.log(data)

					if (response.ok) {
						return true
					}
					else {
						return false
					}

				} catch (error) {
					console.log(error)
				}
			},

			login: async(email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
                        method: "POST",
						headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            email: email,
                            password: password
                        }),                        
                    })
                    const data = await response.json()
                    if (response.ok) {
                        localStorage.setItem("token", data.token)
						setStore({token:data.token})
                        console.log(data)
                        setStore({currentUser:data.user})
                    } else {
                        console.log(data)
                        setStore({currentUser:false})
                    }
                } catch (error) {
                    console.log(error)
                    setStore({currentUser:false})
                }
            },

			logOut: async() => {
				try {
					localStorage.removeItem("token")
					setStore({token:null})
					console.log("logout exitoso")
				} catch (error) {
					console.log(error)
				}
			},

			privateUser: async () => {
				let store = getStore()
				try {
					let response = await fetch(`${process.env.BACKEND_URL}/user`, {
						headers:{
							"Authorization":`Bearer ${store.token}`
						}
					})
					if(response.ok){
						let result = await response.json()
						setStore({
							users:result
						})
					}
					if(response.status == 401 || response.status == 422){
						getActions().logout()
					}
					console.log(response.status)
				} catch (error) {
					conasole.log(error)
				}
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},


		}
	};
};

export default getState;
