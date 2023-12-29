window.onload = async () => {
    if(!document.referrer.includes("booking/booking.html?studio_id=")){
        window.location.href = "/"
        return 
    }

   const searchParams = new URLSearchParams(location.search);
   const bookingNo = searchParams.get('bookingNo');
   const copyText = document.querySelector('.booking-number')
   copyText.innerText = `${bookingNo}`

   //Copy booking no. to clipboard
   const clipboardDiv =  document.querySelector(".clipboard-icon")
   clipboardDiv.addEventListener("click", function(){
        console.log("clicked")
         // Get the text field
         const copyText = document.querySelector('.booking-number')

          // Copy the text inside the text field
         navigator.clipboard.writeText(copyText.innerText);
         
         clipboardDiv.innerHTML = '<i class="bi bi-check2"></i>'

        setTimeout(()=>{
            clipboardDiv.innerHTML = '<i class="bi bi-clipboard"></i>'
        },1500)

    })

}






