function doGet(e) {
  const html = HtmlService.createTemplateFromFile('index');
  html.session = getSession();
  return html.evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Get Session
const getSession = () => Session.getActiveUser().toString();

function driver(val) {
  if(getSession().indexOf('cloudfactory.com') !== -1) {
    let emailHtml = addHtml(val);
    sendEmail(emailHtml);
    return true;
  } else {
    return false;
  }
}

// Add HTML
const addHtml = (val) => {
  let emailHtml = HtmlService.createTemplateFromFile('mail-template').evaluate().getContent();
  let htmlBody = '';
  
  // Table
  htmlBody += `
    <table id="report">
      <tbody>
  `;
  
  // Tr and Td
  val.forEach((row, rowIndex) => {
    
    if(rowIndex === 6) {
      htmlBody += `
        <tr id="header">
          <td></td>
      `;
     } else if(rowIndex === 7 || rowIndex === 12){
         htmlBody += `
           <tr class="sub-section">
         `;
     } else {
       htmlBody += `
        <tr>
      `;
     }
     
     row.forEach((col, colIndex) => {
       if (col !== "") {
         if (rowIndex === 16) {
           if(colIndex === 1) {
             htmlBody += `
               <td class="condition">
                  <div><h4><b>PM REQUIREMENT SCORE</b></h4></div>
                  <div>>7 will require a PM</div>
                  <div>5-7 will need review by PM Leadership to approve/reject</div>
                  <div><5 no PM required</div>
               </td>
             `;
           } else if(colIndex === 3) {
               htmlBody += `
                 <td class="condition"></td>
                 <td class="result"> ${col} </td>
               `;
               if(col > 7){
                 emailHtml = emailHtml.replace('%color', '#009c1d');
               } else if(col >= 5 && col <= 7) {
                   emailHtml = emailHtml.replace('%color', 'orange');
               } else {
                   emailHtml = emailHtml.replace('%color', 'gray');
               }
           } else if(colIndex === 4) {} 
           else {
               htmlBody += `
                 <td class="condition"> ${col} </td>
               `;
           }
         } else if((rowIndex === 7 || rowIndex === 12) && colIndex === 2) {
             htmlBody += `
               <td> ${col} </td>
               <td> ${col} </td>
               <td> ${col} </td>
             `;
         } else {
           htmlBody += `
             <td> ${col} </td>
           `;
         }
         
       }
     });
        
        htmlBody += `
          </tr>
        `;
  });
  
  // Footer
  htmlBody += `
      </tbody>
    </table>  
  `;
  
  emailHtml = emailHtml.replace('%body',htmlBody);
  
  return emailHtml;
}

// Send Email
function sendEmail(emailHtml) {
  MailApp.sendEmail({
    to: getSession(),
    subject: "Program Management ScoreCard",
    htmlBody: emailHtml,
//    cc: 'cc@email.com'
  });
}
