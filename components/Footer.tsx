export function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Built by{' '}
            <a 
              href="https://www.linkedin.com/in/nadjib-bennai/" 
              target="_blank" 
              rel="noopener noreferrer nofollow"
              className="text-black hover:underline"
            >
              Nadjib Bennaï
            </a>{' '}
            - {currentYear}
          </p>
        </div>
      </footer>
    );
  }
  
  