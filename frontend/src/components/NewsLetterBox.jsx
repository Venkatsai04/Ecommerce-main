import React from 'react';

const emailTemplate = (userEmail) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sahara Store Newsletter</title>
</head>
<body style="font-family: 'Arial', sans-serif; margin:0; padding:0; background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff; border-radius:10px; overflow:hidden;">
          <tr>
            <td style="text-align:center; padding:20px;">
              <img src="https://res.cloudinary.com/dindafs0e/image/upload/v1760359380/l9u1bcslkvhywbbuvgqh.jpg" alt="Sahara Store" width="200" style="display:block; margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align:center;">
              <h1 style="color:#333;">Welcome to Sahara Store!</h1>
              <p style="color:#555;">Hi ${userEmail}, thank you for subscribing! Unlock your 20% off on your first order.</p>
              <a href="https://sahara-store.com" style="display:inline-block; margin-top:20px; padding:15px 30px; background-color:#000; color:#fff; text-decoration:none; border-radius:5px;">Shop Now</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px; text-align:center; color:#aaa; font-size:12px;">
              Sahara Store, All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;



const NewsLetterBox = () => {

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const emailInput = event.target.elements[0].value;

        // try {
        //     const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "api-key": "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"
        //         },
        //         body: JSON.stringify({
        //             sender: { name: "Sahara Store", email: "sahara.store.online@gmail.com" },
        //             to: [{ email: emailInput }],
        //             subject: "Welcome to Sahara Store - Get 20% Off!",
        //             htmlContent: emailTemplate(emailInput)
        //         })
        //     });

        //     const data = await res.json();
        //     console.log(data);
        //     alert("Subscription successful!");
        // } catch (err) {
        //     console.error(err);
        //     alert("Failed to subscribe. Try again!");
        // }
    }

    return (
        <div className='mt-10 text-center'>
            <p className='text-2xl font-medium text-gray-800'>Unlock 20% Off | Subscribe Today!</p>
            <p className='mt-3 text-gray-400'>Don't miss out—unlock your savings now by subscribing below!</p>
            <form onSubmit={onSubmitHandler} className='flex items-center w-full gap-3 pl-3 mx-auto my-6 border sm:w-1/2'>
                <input 
                    className='w-full outline-none sm:flex-1' 
                    type="email" 
                    placeholder='hello@gmail.com'
                    required 
                />
                <button type='submit' className='px-10 py-4 text-xs text-white bg-black'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewsLetterBox;
