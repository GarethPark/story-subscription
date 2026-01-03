import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function checkModels() {
  console.log('\n🔍 Testing available Claude models...\n')

  const modelsToTest = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ]

  for (const model of modelsToTest) {
    try {
      console.log(`Testing: ${model}...`)
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hello' }],
      })
      console.log(`✅ ${model} - WORKS!`)
      console.log(`   Response: ${message.content[0].type === 'text' ? message.content[0].text : 'N/A'}\n`)
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`❌ ${model} - NOT FOUND (404)\n`)
      } else {
        console.log(`❌ ${model} - Error: ${error.message}\n`)
      }
    }
  }
}

checkModels()
