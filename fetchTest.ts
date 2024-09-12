const lenovoLegion = {
	type: "computer",
	image: "https://i.imgur.com/IUY0vCR.jpeg",
	name: "Lenovo Legion 5",
	description: "Very nice laptop bla bla bla bla",
	price: "1.299,99 $",
	rating: 3,
	cpu: "I5 12400",
	gpu: "nVidia 4060 8gb",
	comments: [],
};

const samsungGalaxyA15 = {
	type: "phone",
	image: "https://i.imgur.com/BzwqFPM.jpeg",
	name: "Samsung Galaxy A15",
	description: "Mobitel ko mobitel ništa posebno",
	price: "171,99 $",
	rating: 4,
	model: "A 15",
	year: 2023,
	comments: [],
};

const alfaRomeoStelvio = {
	type: "car",
	image: "https://i.imgur.com/JrGFyaX.jpeg",
	name: "Alfa Romeo Stelvio",
	description: "Don't like it really",
	price: "22.999,99 $",
	rating: 4,
	model: "Stelvio",
	year: 2018,
	comments: [],
};

const comment = {
	content: "comment",
	fromUser: { avatar: "https://imgur.com/hCmLdFR.jpeg", username: "Leo" },
	date: "sad",
};

fetch("http://localhost:3000/computers/66e0589db7e11c5719dce822/66e2bebaa1ebfa63c71ee1b1", {
	method: "DELETE",
})
	.then((response) => (!response.ok ? console.log(response) : response.json()))
	.then((data) => console.log(data));

// fetch("http://localhost:3000/products")
// 	.then((response) => (!response.ok ? console.log("response ok?: ", response.ok) : response.json()))
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err));
