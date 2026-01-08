export default function TestImagesPage() {
  const testImages = [
    '/images/genre-tropes/contemporary_grumpy-sunshine.png',
    '/images/genre-tropes/dark-romance_forbidden-love.png',
    '/images/genre-tropes/dark-romance_morally-gray-hero.png',
    '/images/genre-tropes/romantasy_enemies-to-lovers.png',
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Cover Image Test Page</h1>

      <div className="space-y-8">
        {testImages.map((imagePath) => (
          <div key={imagePath} className="border border-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{imagePath}</h2>

            {/* Test 1: Regular img tag */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Test 1: Regular img tag</p>
              <img
                src={imagePath}
                alt="Test"
                className="w-64 h-96 object-cover border border-green-500"
                onError={(e) => {
                  e.currentTarget.style.border = '2px solid red'
                  e.currentTarget.alt = 'FAILED TO LOAD'
                }}
                onLoad={(e) => {
                  console.log('Loaded:', imagePath)
                }}
              />
            </div>

            {/* Test 2: Direct link */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Test 2: Direct link (click to test)</p>
              <a
                href={imagePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {imagePath}
              </a>
            </div>

            {/* Test 3: Background image */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Test 3: Background image</p>
              <div
                className="w-64 h-96 bg-cover bg-center border border-yellow-500"
                style={{ backgroundImage: `url('${imagePath}')` }}
              />
            </div>

            {/* Test 4: Fetch test */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Test 4: Fetch API test</p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(imagePath)
                    const blob = await response.blob()
                    console.log('Fetch success:', imagePath, 'Size:', blob.size, 'Type:', blob.type)
                    alert(`✅ Fetch success: ${imagePath}\nSize: ${blob.size} bytes\nType: ${blob.type}`)
                  } catch (error) {
                    console.error('Fetch failed:', imagePath, error)
                    alert(`❌ Fetch failed: ${imagePath}\n${error}`)
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Test Fetch
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-700 pt-8">
        <h2 className="text-2xl font-bold mb-4">Environment Info</h2>
        <div className="space-y-2 text-sm font-mono">
          <p>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}</p>
          <p>Base URL: {typeof window !== 'undefined' ? window.location.origin : 'SSR'}</p>
          <p>Current Path: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}</p>
        </div>
      </div>
    </div>
  )
}
