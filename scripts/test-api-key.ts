import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.argv[2]

if (!apiKey) {
  console.error('Usage: npx tsx scripts/test-api-key.ts YOUR_API_KEY')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey })

async function testKey() {
  console.log('\n🔑 Testing API key...\n')
  console.log('Key starts with:', apiKey.substring(0, 20) + '...\n')

  // Try simplest possible request with Haiku (cheapest, most available)
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say hello' }],
    })

    console.log('✅ SUCCESS! API key works!')
    console.log('Model:', message.model)
    console.log('Response:', message.content[0].type === 'text' ? message.content[0].text : '')
  } catch (error: any) {
    console.log('❌ ERROR!')
    console.log('Status:', error.status)
    console.log('Message:', error.message)
    console.log('\nFull error:', JSON.stringify(error, null, 2))
  }
}

testKey()
