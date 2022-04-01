var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/jessecoleman/word-crush.git',
        user: {
            name: 'Cole Chamberlin',
            email: 'colechamberlin@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)