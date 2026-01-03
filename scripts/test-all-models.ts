import Anthropic from '@anthropic-ai/sdk'

const apiKey = "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"
const anthropic = new Anthropic({ apiKey })

const models = [
  { name: 'Claude 3 Haiku', id: 'claude-3-haiku-20240307', maxTokens: 4096 },
  { name: 'Claude 3 Sonnet', id: 'claude-3-sonnet-20240229', maxTokens: 4096 },
  { name: 'Claude 3.5 Sonnet (Oct)', id: 'claude-3-5-sonnet-20241022', maxTokens: 8192 },
  { name: 'Claude 3.5 Sonnet (June)', id: 'claude-3-5-sonnet-20240620', maxTokens: 8192 },
  { name: 'Claude 3 Opus', id: 'claude-3-opus-20240229', maxTokens: 4096 },
]

async function testAllModels() {
  console.log('\n🔍 Testing All Claude Models with Your API Key\n')
  console.log('=' .repeat(70))

  for (const model of models) {
    process.stdout.write(`\nTesting ${model.name.padEnd(30)} ... `)

    try {
      const message = await anthropic.messages.create({
        model: model.id,
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Hello, respond with just your model name' }],
      })

      const response = message.content[0].type === 'text' ? message.content[0].text : 'N/A'
      console.log(`✅ WORKS!`)
      console.log(`   Model ID: ${model.id}`)
      console.log(`   Max tokens: ${model.maxTokens.toLocaleString()}`)
      console.log(`   Response: ${response.substring(0, 50)}...`)

    } catch (error: any) {
      if (error.status === 404) {
        console.log(`❌ NOT FOUND (404)`)
        console.log(`   This model is not accessible with your API key`)
      } else if (error.status === 401) {
        console.log(`❌ UNAUTHORIZED (401)`)
        console.log(`   API key doesn't have permission`)
      } else {
        console.log(`❌ ERROR (${error.status || 'unknown'})`)
        console.log(`   ${error.message}`)
      }
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n💡 Recommendation:')
  console.log('   - If only Haiku works: Contact Anthropic support')
  console.log('   - If Sonnet works: Use that for better stories!')
  console.log('   - Check: https://console.anthropic.com/settings/models')
  console.log('')
}

testAllModels()
