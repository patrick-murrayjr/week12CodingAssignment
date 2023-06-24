const URL_ENDPOINT = 'https://648e9ffa75a96b6644441eb6.mockapi.io/customers';
const today = new Date().toISOString().substring(0, 10);

/**
 * drawTable()
 *
 * Renders the table to the page.
 *
 * The function removes all td elements from the webpage.
 * Then, an API call is made which retrieves data from a server.
 * Once the data is retrieved, the map() method is called on it to create a new array with the data
 * Inside the map() function, a new tr element is created in the table for each subscriber of the API data.
 * Each subscriber's data is added to appropriate td element and buttons for update and delete are also added to each row.
 * Finally, each  table row is appended to the existing table.
 */
function drawTable() {
   // console.log('drawTable Called');

   $.get(URL_ENDPOINT).then(data => {
      $('td').remove();
      data.map(subscriber => {
         $('#list').append(
            $(`<tr>
        <td>${subscriber.id}</td>
        <td>${subscriber.accountNumber}</td>
        <td>${subscriber.userName}</td>
        <td>${subscriber.lastName}, ${subscriber.firstName}</td>
        <td>${subscriber.email}</td>
        <td>${subscriber.createdAt}</td>
        <td><b>Status:</b> ${subscriber.active}<br><b>Tier:</b> ${subscriber.plan}<br><b>Billed:</b> ${subscriber.billingCycle}<br></td>
        <td>
            <button class="btn btn-warning m-1 btn-standard-width" onclick="updateSubscriberScreen(${subscriber.id})">Update</button><br>
            <button class="btn btn-danger m-1 btn-standard-width" onclick="deleteSubscriber(${subscriber.id})">Delete</button>
        </td>
      </tr>`)
         );
      });
   });
}

/**
 * This code adds a click event listener to the submit-button
 * When clicked, it generates a random number and formats it to display a six-digit account number.
 * It then prepends the year to the beggining of the account so it takes the format 2023-123456
 * Then, it sends a POST request to the URL endpoint with the data entered into the form.
 * Finally, this code rests the values in the form and repopulates the createdDate field with today's date
 *  after the POST request is complete.
 */
$('#form').on('submit', e => {
   e.preventDefault();
   // console.log('submit-button clicked');
   const newAcct = `2023-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')}`;

   $.post(URL_ENDPOINT, {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      userName: $('#userName').val(),
      email: $('#email').val(),
      accountNumber: newAcct,
      createdAt: $('#createdDate').val(),
      plan: $('#plan').val(),
      billingCycle: $('#billingCycle').val(),
      active: $('#isActive').val(),
   }).then(() => {
      //redraw table and then clear form fields
      drawTable();
      document.getElementById('form').reset();
      $('#createdDate').val(today);
   });
});

/**
 * The code adds an event listener to the clear-form-button.
 * When the button is clicked, the current date is assigned to the variable 'today'.
 * Then the input fields; 'firstName', 'lastName', 'userName', 'email', and 'accountNumber' are cleared
 * and then it repopulates the createdDate field with today's date
 */
$('#clear-form-button').on('click', e => {
   e.preventDefault();
   // console.log('clear-form-button clicked');
   $('#firstName').val('');
   $('#lastName').val('');
   $('#userName').val('');
   $('#email').val('');
   $('#createdDate').val(today);
});

/**
 * updateSubscriberScreen(id)
 *
 * This function updates the subscriber's information displayed on the screen using the subscriber's id.
 * Then, it makes an AJAX request to GET information for the subscriber with that id.
 * If the GET request is successful, the callback updates the modal fields with the subscriber's information.
 * Finally it populates the modal with the updated subscriber information.
 */
function updateSubscriberScreen(id) {
   // console.log(`updateSubscriberScreen Called for id:${id}`);
   // get info for subscriber
   // populate modal fields with subscriber info
   $.ajax(`${URL_ENDPOINT}/${id}`, {
      method: 'GET',
   }).then(subscriber => {
      // console.log(subscriber);
      $('#accountNumberModal').text(`Account #: ${subscriber.accountNumber}`);
      $('#dateCreatedModal').text(`Member since: ${subscriber.createdAt}`);
      $('#firstNameModal').val(subscriber.firstName);
      $('#lastNameModal').val(subscriber.lastName);
      $('#userNameModal').val(subscriber.userName);
      $('#emailModal').val(subscriber.email);
      $('#planModal').val(subscriber.plan);
      $('#billingCycleModal').val(subscriber.billingCycle);
      $('#isActiveModal').val(subscriber.active);

      // Show Modal with id parameter
      $('#updateSubscriberModal').modal('show').data('id', id);
   });
}

/**
 * Event Listener for modal Update button
 *
 * This code selects the updateButton and adds a click event listener to it.
 * When the button is clicked, the code retrieves the ID value from the updateSubscriberModal.
 * Then it calls the updateSubscriber() function with the ID as a parameter.
 */
$('#updateButton').on('click', () => {
   const id = $('#updateSubscriberModal').data('id');
   updateSubscriber(id);
});

/**
 * updateSubscriber(id)
 *
 * This function takes an id parameter and updates a subscriber record with that id.
 * It then makes an AJAX call to the endpoint URL with the subscriber id passed in, using the PUT method.
 * The content type is set to application/json and the function serializes the data into JSON using the JSON.stringify() method.
 * The function then redraws the table
 */
function updateSubscriber(id) {
   // console.log('updateSubscriber Called');
   // console.log(`ID: ${id}`);
   $.ajax(`${URL_ENDPOINT}/${id}`, {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
         firstName: $('#firstNameModal').val(),
         lastName: $('#lastNameModal').val(),
         userName: $('#userNameModal').val(),
         email: $('#emailModal').val(),
         plan: $('#planModal').val(),
         billingCycle: $('#billingCycleModal').val(),
         active: $('#isActiveModal').val(),
      }),
   }).then(drawTable);
   // .then(() => console.log(`Subscriber: ${id} Updated`));
}

/**
 * deleteSubscriber(id)
 *
 * This is a JavaScript function that deletes a subscriber.
 * The function takes one parameter, which is the id of the subscriber to be deleted.
 * It then sends an HTTP DELETE request with the id of the subscriber appended to the URL as a parameter.
 * After sending the DELETE request, the function calls the drawTable() function.
 */
function deleteSubscriber(id) {
   // console.log('deleteSubscriber Called');
   $.ajax(`${URL_ENDPOINT}/${id}`, {
      method: 'DELETE',
   }).then(drawTable);
   // .then(() => console.log(`Subscriber: ${id} Deleted`));
}

//draw table upon initial page load.
document.addEventListener('DOMContentLoaded', () => {
   drawTable();
   $('#createdDate').val(today);
});
