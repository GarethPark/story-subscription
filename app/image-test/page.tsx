export default function ImageTest() {
  const testUrl = "https://raw.githubusercontent.com/GarethPark/story-subscription/main/public/covers/romantasy_enemies-to-lovers.png"

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-white text-3xl mb-8">Image Test - Regular IMG Tag</h1>

      <div className="bg-white p-4 inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={testUrl}
          alt="Test"
          className="w-64 h-96 object-cover"
        />
      </div>

      <p className="text-white mt-4">URL: {testUrl}</p>
      <p className="text-green-400 mt-2">If you see the image above, GitHub URLs work!</p>
    </div>
  )
}
