fetch("http://localhost:3000")
	.then((response) => (!response.ok ? console.log("bad request") : response.json()))
	.then((data) => console.log(data));

fetch("http://localhost:3000/users", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		username: "Leo",
		password: "12345",
	}),
})
	.then((response) => response.json())
	.then((data) => console.log(data));
