const ROOT = "https://api.jsonbin.io/v3/b/6750bffead19ca34f8d5adec";

let recipeData = {}; // Global object to store recipe data
let AllTabs = [];

document.addEventListener("DOMContentLoaded", () => {
    const TABhome = document.querySelector("#tabs");
    const center = document.querySelector("#recipe-box");
    const modal = document.getElementById("modal-view");
    const modalContent = modal.querySelector(".modal-content");
    const modalOverlay = document.getElementById("modal-overlay");

    const addRecipeButton = document.querySelector(".button#add-recipe");
    const addFileButton = document.getElementById("button.new-file");
    const searchButton = document.querySelector(".button.search");

    // Fetch the JSON data
    fetch(ROOT)
        .then((response) => response.json())
        .then((data) => {
            const recipeTypes = data.record;
            populateTabs(recipeTypes);

            // Create setups for creating new elements
            let recipeNuevo = document.createElement("form");
            recipeNuevo.classList.add("RecipeGuts");

            recipeNuevo.innerHTML = `
                <h2>New Recipe!</h2>
                <p>&#10071; Everywhere you expect a new line or want your text separated, insert: "\\ ". There is a space at the end &#128513;</p>
                <br>
                <label for="elegir">Recipe Category: </label>
                <select name="elegir" id="elegir">
                    <option value="" disabled selected>Select Category</option>
                </select>
                <br>
                <label for="NombreDeReceta">Recipe Name: </label>
                <input type="text" placeholder="mouth watering delicacy..." name="NombreDeReceta" id="NombreDeReceta" required>
                <br>
                <label for="LasDestacas">Highlights: </label>
                <textarea name="LasDestacas" placeholder="\\ oven temp... \\ quantity... \\ rises... \\ cook time..." id="LasDestacas"></textarea>
                <br>
                <h4>Recipe Ingredients:</h4>
                <textarea placeholder="\\ Salt... \\ Pepper... \\ Onions... " id="LosIngredientes" required></textarea>
                <br>
                <h4>Recipe Directions:</h4>
                <textarea placeholder="\\ combine dry... \\ combine wet... \\ whip... \\ stir..." id="LasDirecciones" required></textarea>
                <br>
                <h4>Notes:</h4>
                <textarea placeholder="better with... better without... add..." id="LasNotas"></textarea>
                <br>
                <button id="send">Create Recipe</button>
            `;

            // Populate the select element with categories
            const selectElement = recipeNuevo.querySelector("#elegir");
            AllTabs.forEach((category) => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                selectElement.appendChild(option);
            });

            // Add event listener for the #send button
            recipeNuevo.querySelector("#send").addEventListener("click", (event) => {
                event.preventDefault();

                // Collect values from form fields
                const chosenCategory = document.getElementById("elegir").value;

                const name = document.getElementById("NombreDeReceta").value;
                const highlights = document.getElementById("LasDestacas").value.split("\\ ").map((s) => s.trim()).filter(Boolean);
                const ingredients = document.getElementById("LosIngredientes").value.split("\\ ").map((s) => s.trim()).filter(Boolean);
                const directions = document.getElementById("LasDirecciones").value.split("\\ ").map((s) => s.trim()).filter(Boolean);
                const notes = document.getElementById("LasNotas").value;

                if (!name || !ingredients.length || !directions.length) {
                    alert("Please fill in all required fields");
                    return;
                }

                const newRecipe = {
                    name: name,
                    highlights: highlights,
                    ingredients: ingredients,
                    directions: directions,
                    notes: notes,
                    created: new Date().toLocaleString(), // Add a created timestamp
                }
                recipeTypes[chosenCategory].push(newRecipe)

                const myHeaders = new Headers();
                myHeaders.append("X-Master-Key", "$2a$10$ygr7psflJeTexOuHJeflPu7eyMADOF/RMeBH9juPTzb1t/bo/DiZO");
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify(recipeTypes);

                const requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("https://api.jsonbin.io/v3/b/6750bffead19ca34f8d5adec", requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        console.log(result)
                        location.reload()
                    })
                    .catch((error) => console.error(error));
            });



            document.getElementById("add-recipe").addEventListener("click", () => {
                newThingyModal(recipeNuevo);
            });


            // New tab formatting + functions
            const tabNuevo = document.createElement("form");
            tabNuevo.classList.add("TabGuts");

            tabNuevo.innerHTML = `
                <label id="ficha-label" for="ficha">New Tab Name: </label>
                <input type="text" name="ficha" id="ficha" placeholder="Casseroles..." required>

                <button id="yeet">Create Tab</button>
            `;

            tabNuevo.querySelector("#yeet").addEventListener("click", (event) => {
                event.preventDefault();
                // Collect values from field
                const LeTab = document.getElementById("ficha").value;
                if (!LeTab) {
                    alert("Please fill in all required fields");
                    return;
                }

                recipeTypes[LeTab] = []

                const myHeaders = new Headers();
                myHeaders.append("X-Master-Key", "$2a$10$ygr7psflJeTexOuHJeflPu7eyMADOF/RMeBH9juPTzb1t/bo/DiZO");
                myHeaders.append("Content-Type", "application/json");

                const raw = JSON.stringify(recipeTypes);

                const requestOptions = {
                    method: "PUT",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("https://api.jsonbin.io/v3/b/6750bffead19ca34f8d5adec", requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        console.log(result)
                        location.reload()
                    })
                    .catch((error) => console.error(error));
            });

            document.getElementById("new-file").addEventListener("click", () => {
                newThingyModal(tabNuevo);
            })

            function newThingyModal(content) {
                const modal = document.getElementById("modal-view");
                const modalOverlay = document.getElementById("modal-overlay");
                const modalContent = modal.querySelector(".modal-content");

                modalContent.innerHTML = "";
                modalContent.appendChild(content);
                modal.style.display = "block";
                modalOverlay.classList.add("active"); // Show the overlay
            }

            // Close Modal Event
            document.getElementById("modal-overlay").addEventListener("click", () => {
                modal.style.display = "none";
                modalOverlay.classList.remove("active");
            });

            // Close Modal Event for close button
            document.querySelector(".modal-close").addEventListener("click", () => {
                modal.style.display = "none";
                modalOverlay.classList.remove("active");
            });

            // Close Modal Event for Esc key
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    modal.style.display = "none";
                    modalOverlay.classList.remove("active");
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));

    // Populate the tabs section
    function populateTabs(recipeTypes) {
        TABhome.innerHTML = ""; // Clear existing tabs
        for (let category in recipeTypes) {
            AllTabs.push(category);
            console.log(AllTabs); // Log AllTabs during population

            const tab = document.createElement("div");
            tab.classList.add("tab");
            tab.textContent = category;
            TABhome.appendChild(tab);

            // Add event listener to load recipes for the category
            tab.addEventListener("click", () => populateCenter(recipeTypes[category]));
        }
    }

    // Populate the center with recipes
    function populateCenter(recipes) {
        center.innerHTML = ""; // Clear previous content
        recipes.forEach((recipe) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            // Add title
            const title = document.createElement("h3");
            title.textContent = recipe.name;
            recipeCard.appendChild(title);

            // Add highlights
            const highlights = document.createElement("p");
            highlights.textContent = recipe.highlights.join(" | ");
            recipeCard.appendChild(highlights);

            // Add click event to open modal
            recipeCard.addEventListener("click", () => openModal(recipe));
            center.appendChild(recipeCard);
        });
    }

    // Function to open modal
    function openModal(recipe) {
        modalContent.innerHTML = `
            <h2>${recipe.name}</h2>
            <p id="dramaticButton">${recipe.highlights.join("  |  ")}</p>
            <ul><strong>Ingredients:</strong> 
                ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
            </ul>
            <ol><strong>Directions:</strong> 
                ${recipe.directions.map((step) => `<li>${step}</li>`).join("")}
            </ol>
            <p><strong>Notes:</strong> ${recipe.notes || "None"}</p>
            <p><strong>Created:</strong> ${recipe.created || "None"}</p>
        `;
        modal.style.display = "block";
        modalOverlay.classList.add("active"); // Show the overlay
    }

    // Close Modal Event
    document.getElementById("modal-overlay").addEventListener("click", () => {
        modal.style.display = "none";
        modalOverlay.classList.remove("active");
    });

    // Close Modal Event for close button
    document.querySelector(".modal-close").addEventListener("click", () => {
        modal.style.display = "none";
        modalOverlay.classList.remove("active");
    });
});
