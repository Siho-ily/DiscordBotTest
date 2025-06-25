import { CommandData } from '../../structures/BaseCommand.js';

export default new CommandData({
	name: 'test',
	aliases: ['테스트'],
	description: '테스트용 커맨드입니다.',
	options: [
		{
			name: 'query',
			description: '테스트 쿼리',
			type: 'String',
			autoComplete: true,
		},
	],

	async autocomplete(interaction) {
		try {
			console.log(`[자동완성 호출됨] 명령어: ${interaction.commandName}`);

			const focused = interaction.options.getFocused(true);
			console.log(`[입력 중 옵션] ${focused.name}: ${focused.value}`);

			const results = ['테스트1', '테스트2', '테스트3'].filter((x) => x.toLowerCase().includes(focused.value.toLowerCase()));

			// 응답 보내기
			await interaction.respond(
				results.length > 0 ? results.map((choice) => ({ name: choice, value: choice })) : [{ name: '일치 없음', value: 'none' }]
			);

			console.log(`[응답 완료] ${results.length}개 추천`);
		} catch (err) {
			console.error(`[자동완성 오류 발생]:`, err);
		}
	},

	async execute(context) {
		try {
			await context.deferReply();
			await context.editReply(
				'✅ 테스트 명령어가 성공적으로 실행되었습니다! 쿼리: ' + context.interaction.options.getString('query', false) || '쿼리가 없습니다.'
			);
		} catch (error) {
			console.error('❌ Test 명령어 처리 중 오류:', error);
			if (context.type === 'slash' && !context.interaction.replied) {
				await context.interaction.editReply('⚠️ 오류가 발생했습니다.');
			}
		}
	},
});
