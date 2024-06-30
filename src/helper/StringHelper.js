exports.generateRandom = (length) => {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

exports.generateRandomNumber = (length) => {
  var result           = [];
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

exports.generateRandomCapital = (length) => {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * 
charactersLength)));
 }
 return result.join('');
}

exports.removeSpaces = (inputString) => {
  if (typeof inputString !== 'string') {
    throw new Error('Input should be a string');
  }
  return inputString.replace(/\s/g, ''); 
};

exports.generateRandomDigitWithDate = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  
  const currentDate = new Date();
  
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  
  const formattedDate = randomNumber.toString().padStart(4, '0') + day + month + year;
  
  return formattedDate;
}

exports.toSentenceCase = (str) => {
  if (!str) return '';

  const words = str.split(' ');

  const sentenceCaseWords = words.map(word => {
      if (word.length === 0) return '';
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return sentenceCaseWords.join(' ');
}

exports.transformCategory = (input) => {
  const categoryMap = new Map()

    input.forEach(category=> {
        categoryMap.set(category.id, {
            id: category.id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            deletedAt: category.deletedAt,
            subCategory: []
        })
    })

    input.forEach(category => {
        if(category.parent_id !== null){
            categoryMap.get(category.parent_id).subCategory.push(categoryMap.get(category.id))
        }
    })

    const resultData = []
    categoryMap.forEach(category=> {
        if(category.subCategory.length === 0){
            category.subCategory = null
        }
        if(input.find(item => item.id === category.id).parent_id === null){
            resultData.push(category)
        }
    })

    return resultData
}