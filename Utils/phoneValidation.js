export const formatPhoneNumber = number => {
  // форматування номера телефону
  const cleaned = number.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  let formattedNumber = '';
  if (match) {
    const [fullMatch, countryCode, areaCode, firstPart, secondPart, thirdPart] = match;
    formattedNumber = '';

    if (countryCode && countryCode.charAt(0) === '0') {
      formattedNumber += '+38' + countryCode;
    } else if (countryCode) {
      formattedNumber += '+' + countryCode;
    }

    if (areaCode) {
      formattedNumber += ' (' + areaCode;
      if (firstPart) {
        formattedNumber += ') ' + firstPart;
        if (secondPart) {
          formattedNumber += '-' + secondPart;
          if (thirdPart) {
            formattedNumber += '-' + thirdPart;
          }
        }
      }
    }
  }
  return formattedNumber;
};
