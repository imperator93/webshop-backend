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

fetch("http://localhost:3000/computers", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(lenovoLegion),
})
	.then((response) => (!response.ok ? console.log("bad request") : response.json()))
	.then((data) => console.log(data));
