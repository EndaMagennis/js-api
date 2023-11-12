const API_KEY = "ldLcRZx5bDje9E2fMnZBd4gDK1Q";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// Get the form
async function getStatus(e) {
    // Prevent default action
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    // Get the form data
    const response = await fetch(queryString);
    // Get the response
    const data = await response.json();
    
    // Display the response
    if(response.ok) {
        // Display the data
        displayStatus(data);
    } else {
        // Display the error
        displayExceptions(data);
        throw new Error(data.error);
    }
}

// Display the status
function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>
                    <div>${data.expiry}</div>`;

    // 
    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    // Show the modal
    resultsModal.show();
}

function displayErrors(data){
    let heading = `JSHint Results for ${data.file}`;

    // If there are no errors
    if(data.total_errors === 0){
        // Display a message
        results = `<div class="no_errors">No Errors Reported!</div>`;
    }else{
        // Display each error
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for(let error of data.error_list){
            results += `<div>At Line: <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</span></div>`;
        }
    }
    // Display the results
    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

function processOptions(form) {

    let optArray = [];
    // Iterate over the entries
    for (let entry of form.entries()){
        // If the entry is an option
        if (entry[0] === "options") {
            // Add the value to the array
            optArray.push(entry[1]);
        }
    }
    
    // Delete the options key from the form data
    form.delete("options");
    // Add back the values as a comma separated string
    form.append("options", optArray.join());
    // Return the form data
    return form;
}

async function postForm(e){

    // Prevent default action
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // Get the form data
    const response = await fetch(API_URL, {
                        method: "POST",
                        headers:{
                                    "Authorization": API_KEY,
                        },
                        body: form,
    })
    // Get the response
    const data = await response.json()
    // Display the response
    if(response.ok){
        displayErrors(data);
    } else {
        // Display the error
        displayExceptions(data);
        throw new Error(data.error);
    }
}

// Display the exceptions
function displayExceptions(data){
    let heading = `An Exception has occured`;
    
    results = `<div>The API returned a status code ${data.status_code}, </div>`;
    results += `<div>Error Number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error Text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}