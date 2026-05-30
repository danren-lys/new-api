/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Select,
  Slider,
  TextArea,
  Typography,
  RadioGroup,
  Radio,
} from '@douyinfe/semi-ui';
import { Volume2, Download, Loader2, Link } from 'lucide-react';
import { API, showError, showSuccess } from '../../helpers';

const { Title, Text } = Typography;

const VOICE_OPTIONS = [
  // ===== 中文（普通话）=====
  { value: 'male-qn-qingse', label: '青涩青年' },
  { value: 'male-qn-jingying', label: '精英青年' },
  { value: 'male-qn-badao', label: '霸道青年' },
  { value: 'male-qn-daxuesheng', label: '青年大学生' },
  { value: 'female-shaonv', label: '少女' },
  { value: 'female-yujie', label: '御姐' },
  { value: 'female-chengshu', label: '成熟女性' },
  { value: 'female-tianmei', label: '甜美女性' },
  { value: 'male-qn-qingse-jingpin', label: '青涩青年 β' },
  { value: 'male-qn-jingying-jingpin', label: '精英青年 β' },
  { value: 'male-qn-badao-jingpin', label: '霸道青年 β' },
  { value: 'male-qn-daxuesheng-jingpin', label: '青年大学生 β' },
  { value: 'female-shaonv-jingpin', label: '少女 β' },
  { value: 'female-yujie-jingpin', label: '御姐 β' },
  { value: 'female-chengshu-jingpin', label: '成熟女性 β' },
  { value: 'female-tianmei-jingpin', label: '甜美女性 β' },
  { value: 'clever_boy', label: '聪明男童' },
  { value: 'cute_boy', label: '可爱男童' },
  { value: 'lovely_girl', label: '萌萌女童' },
  { value: 'cartoon_pig', label: '卡通猪小琪' },
  { value: 'bingjiao_didi', label: '病娇弟弟' },
  { value: 'junlang_nanyou', label: '俊朗男友' },
  { value: 'chunzhen_xuedi', label: '纯真学弟' },
  { value: 'lengdan_xiongzhang', label: '冷淡学长' },
  { value: 'badao_shaoye', label: '霸道少爷' },
  { value: 'tianxin_xiaoling', label: '甜心小玲' },
  { value: 'qiaopi_mengmei', label: '俏皮萌妹' },
  { value: 'wumei_yujie', label: '妩媚御姐' },
  { value: 'diadia_xuemei', label: '嗲嗲学妹' },
  { value: 'danya_xuejie', label: '淡雅学姐' },
  { value: 'Chinese (Mandarin)_Reliable_Executive', label: '沉稳高管' },
  { value: 'Chinese (Mandarin)_News_Anchor', label: '新闻女声' },
  { value: 'Chinese (Mandarin)_Mature_Woman', label: '傲娇御姐' },
  { value: 'Chinese (Mandarin)_Unrestrained_Young_Man', label: '不羁青年' },
  { value: 'Arrogant_Miss', label: '嚣张小姐' },
  { value: 'Robot_Armor', label: '机械战甲' },
  { value: 'Chinese (Mandarin)_Kind-hearted_Antie', label: '热心大婶' },
  { value: 'Chinese (Mandarin)_HK_Flight_Attendant', label: '港普空姐' },
  { value: 'Chinese (Mandarin)_Humorous_Elder', label: '搞笑大爷' },
  { value: 'Chinese (Mandarin)_Gentleman', label: '温润男声' },
  { value: 'Chinese (Mandarin)_Warm_Bestie', label: '温暖闺蜜' },
  { value: 'Chinese (Mandarin)_Male_Announcer', label: '播报男声' },
  { value: 'Chinese (Mandarin)_Sweet_Lady', label: '甜美女声' },
  { value: 'Chinese (Mandarin)_Southern_Young_Man', label: '南方小哥' },
  { value: 'Chinese (Mandarin)_Wise_Women', label: '阅历姐姐' },
  { value: 'Chinese (Mandarin)_Gentle_Youth', label: '温润青年' },
  { value: 'Chinese (Mandarin)_Warm_Girl', label: '温暖少女' },
  { value: 'Chinese (Mandarin)_Kind-hearted_Elder', label: '花甲奶奶' },
  { value: 'Chinese (Mandarin)_Cute_Spirit', label: '憨憨萌兽' },
  { value: 'Chinese (Mandarin)_Radio_Host', label: '电台男主播' },
  { value: 'Chinese (Mandarin)_Lyrical_Voice', label: '抒情男声' },
  { value: 'Chinese (Mandarin)_Straightforward_Boy', label: '率真弟弟' },
  { value: 'Chinese (Mandarin)_Sincere_Adult', label: '真诚青年' },
  { value: 'Chinese (Mandarin)_Gentle_Senior', label: '温柔学姐' },
  { value: 'Chinese (Mandarin)_Stubborn_Friend', label: '嘴硬竹马' },
  { value: 'Chinese (Mandarin)_Crisp_Girl', label: '清脆少女' },
  { value: 'Chinese (Mandarin)_Pure-hearted_Boy', label: '清澈邻家弟弟' },
  { value: 'Chinese (Mandarin)_Soft_Girl', label: '柔和少女' },
  // ===== 中文（粤语）=====
  { value: 'Cantonese_ProfessionalHost（F)', label: '[粤语] 专业女主持' },
  { value: 'Cantonese_GentleLady', label: '[粤语] 温柔女声' },
  { value: 'Cantonese_ProfessionalHost（M)', label: '[粤语] 专业男主持' },
  { value: 'Cantonese_PlayfulMan', label: '[粤语] 活泼男声' },
  { value: 'Cantonese_CuteGirl', label: '[粤语] 可爱女孩' },
  { value: 'Cantonese_KindWoman', label: '[粤语] 善良女声' },
  // ===== 英文 =====
  { value: 'Santa_Claus', label: '[EN] Santa Claus' },
  { value: 'Grinch', label: '[EN] Grinch' },
  { value: 'Rudolph', label: '[EN] Rudolph' },
  { value: 'Arnold', label: '[EN] Arnold' },
  { value: 'Charming_Santa', label: '[EN] Charming Santa' },
  { value: 'Charming_Lady', label: '[EN] Charming Lady' },
  { value: 'Sweet_Girl', label: '[EN] Sweet Girl' },
  { value: 'Cute_Elf', label: '[EN] Cute Elf' },
  { value: 'Attractive_Girl', label: '[EN] Attractive Girl' },
  { value: 'Serene_Woman', label: '[EN] Serene Woman' },
  { value: 'English_Trustworthy_Man', label: '[EN] Trustworthy Man' },
  { value: 'English_Graceful_Lady', label: '[EN] Graceful Lady' },
  { value: 'English_Aussie_Bloke', label: '[EN] Aussie Bloke' },
  { value: 'English_Whispering_girl', label: '[EN] Whispering Girl' },
  { value: 'English_Diligent_Man', label: '[EN] Diligent Man' },
  { value: 'English_Gentle-voiced_man', label: '[EN] Gentle-voiced Man' },
  // ===== 日文 =====
  { value: 'Japanese_IntellectualSenior', label: '[JP] Intellectual Senior' },
  { value: 'Japanese_DecisivePrincess', label: '[JP] Decisive Princess' },
  { value: 'Japanese_LoyalKnight', label: '[JP] Loyal Knight' },
  { value: 'Japanese_DominantMan', label: '[JP] Dominant Man' },
  { value: 'Japanese_SeriousCommander', label: '[JP] Serious Commander' },
  { value: 'Japanese_ColdQueen', label: '[JP] Cold Queen' },
  { value: 'Japanese_DependableWoman', label: '[JP] Dependable Woman' },
  { value: 'Japanese_GentleButler', label: '[JP] Gentle Butler' },
  { value: 'Japanese_KindLady', label: '[JP] Kind Lady' },
  { value: 'Japanese_CalmLady', label: '[JP] Calm Lady' },
  { value: 'Japanese_OptimisticYouth', label: '[JP] Optimistic Youth' },
  { value: 'Japanese_GenerousIzakayaOwner', label: '[JP] Generous Izakaya Owner' },
  { value: 'Japanese_SportyStudent', label: '[JP] Sporty Student' },
  { value: 'Japanese_InnocentBoy', label: '[JP] Innocent Boy' },
  { value: 'Japanese_GracefulMaiden', label: '[JP] Graceful Maiden' },
  // ===== 韩文 =====
  { value: 'Korean_SweetGirl', label: '[KR] Sweet Girl' },
  { value: 'Korean_CheerfulBoyfriend', label: '[KR] Cheerful Boyfriend' },
  { value: 'Korean_EnchantingSister', label: '[KR] Enchanting Sister' },
  { value: 'Korean_ShyGirl', label: '[KR] Shy Girl' },
  { value: 'Korean_ReliableSister', label: '[KR] Reliable Sister' },
  { value: 'Korean_StrictBoss', label: '[KR] Strict Boss' },
  { value: 'Korean_SassyGirl', label: '[KR] Sassy Girl' },
  { value: 'Korean_PlayboyCharmer', label: '[KR] Playboy Charmer' },
  { value: 'Korean_ElegantPrincess', label: '[KR] Elegant Princess' },
  { value: 'Korean_BraveFemaleWarrior', label: '[KR] Brave Female Warrior' },
  { value: 'Korean_BraveYouth', label: '[KR] Brave Youth' },
  { value: 'Korean_CalmLady', label: '[KR] Calm Lady' },
  { value: 'Korean_EnthusiasticTeen', label: '[KR] Enthusiastic Teen' },
  { value: 'Korean_SoothingLady', label: '[KR] Soothing Lady' },
  { value: 'Korean_IntellectualSenior', label: '[KR] Intellectual Senior' },
  { value: 'Korean_LonelyWarrior', label: '[KR] Lonely Warrior' },
  { value: 'Korean_MatureLady', label: '[KR] Mature Lady' },
  { value: 'Korean_InnocentBoy', label: '[KR] Innocent Boy' },
  { value: 'Korean_CharmingSister', label: '[KR] Charming Sister' },
  { value: 'Korean_DecisiveQueen', label: '[KR] Decisive Queen' },
  { value: 'Korean_ColdYoungMan', label: '[KR] Cold Young Man' },
  { value: 'Korean_MysteriousGirl', label: '[KR] Mysterious Girl' },
  { value: 'Korean_QuirkyGirl', label: '[KR] Quirky Girl' },
  { value: 'Korean_ConsiderateSenior', label: '[KR] Considerate Senior' },
  { value: 'Korean_CheerfulLittleSister', label: '[KR] Cheerful Little Sister' },
  { value: 'Korean_DominantMan', label: '[KR] Dominant Man' },
  { value: 'Korean_AirheadedGirl', label: '[KR] Airheaded Girl' },
  { value: 'Korean_ReliableYouth', label: '[KR] Reliable Youth' },
  { value: 'Korean_FriendlyBigSister', label: '[KR] Friendly Big Sister' },
  { value: 'Korean_GentleBoss', label: '[KR] Gentle Boss' },
  { value: 'Korean_ColdGirl', label: '[KR] Cold Girl' },
  { value: 'Korean_HaughtyLady', label: '[KR] Haughty Lady' },
  { value: 'Korean_IntellectualMan', label: '[KR] Intellectual Man' },
  { value: 'Korean_CaringWoman', label: '[KR] Caring Woman' },
  { value: 'Korean_WiseTeacher', label: '[KR] Wise Teacher' },
  { value: 'Korean_ConfidentBoss', label: '[KR] Confident Boss' },
  { value: 'Korean_PossessiveMan', label: '[KR] Possessive Man' },
  { value: 'Korean_GentleWoman', label: '[KR] Gentle Woman' },
  { value: 'Korean_CockyGuy', label: '[KR] Cocky Guy' },
  { value: 'Korean_OptimisticYouth', label: '[KR] Optimistic Youth' },
  // ===== 其他语言 =====
  { value: 'Spanish_SereneWoman', label: '[ES] Serene Woman' },
  { value: 'Spanish_Narrator', label: '[ES] Narrator' },
  { value: 'French_Male_Speech_New', label: '[FR] Level-Headed Man' },
  { value: 'French_Female_News Anchor', label: '[FR] Patient Female Presenter' },
  { value: 'Indonesian_SweetGirl', label: '[ID] Sweet Girl' },
  { value: 'German_FriendlyMan', label: '[DE] Friendly Man' },
  { value: 'Russian_BrightHeroine', label: '[RU] Bright Queen' },
  { value: 'Italian_BraveHeroine', label: '[IT] Brave Heroine' },
  { value: 'Arabic_CalmWoman', label: '[AR] Calm Woman' },
  { value: 'Turkish_CalmWoman', label: '[TR] Calm Woman' },
  { value: 'Vietnamese_kindhearted_girl', label: '[VI] Kind-hearted Girl' },
  { value: 'Thai_male_1_sample8', label: '[TH] Serene Man' },
  { value: 'Thai_female_1_sample1', label: '[TH] Confident Woman' },
  { value: 'Polish_male_1_sample4', label: '[PL] Male Narrator' },
  { value: 'Portuguese_SentimentalLady', label: '[PT] Sentimental Lady' },
  { value: 'Portuguese_Narrator', label: '[PT] Narrator' },
  { value: 'Dutch_kindhearted_girl', label: '[NL] Kind-hearted Girl' },
  { value: 'Ukrainian_CalmWoman', label: '[UK] Calm Woman' },
  { value: 'hindi_male_1_v2', label: '[HI] Trustworthy Advisor' },
  { value: 'hindi_female_2_v1', label: '[HI] Tranquil Woman' },
];

const MODEL_OPTIONS = [
  { value: 'speech-2.8-hd', label: 'speech-2.8-hd (最新高清)' },
  { value: 'speech-2.8-turbo', label: 'speech-2.8-turbo (最新快速)' },
  { value: 'speech-2.6-hd', label: 'speech-2.6-hd (高清)' },
  { value: 'speech-2.6-turbo', label: 'speech-2.6-turbo (快速)' },
  { value: 'speech-02-hd', label: 'speech-02-hd (高清)' },
  { value: 'speech-02-turbo', label: 'speech-02-turbo (快速)' },
];

const FORMAT_OPTIONS = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'flac', label: 'FLAC' },
];

const TTS_API_ENDPOINT = '/pg/audio/speech';

function TextToSpeech() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].value);
  const [model, setModel] = useState('speech-2.8-turbo');
  const [speed, setSpeed] = useState(1.0);
  const [format, setFormat] = useState('mp3');
  const [deliveryMode, setDeliveryMode] = useState('play');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      showError(t('请输入要转换的文本'));
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setDownloadLink(null);

    try {
      const responseFormat = deliveryMode === 'url' ? 'url' : format;

      const payload = {
        model,
        input: text,
        voice,
        response_format: responseFormat,
        speed,
      };

      const config = { skipErrorHandler: true };
      if (deliveryMode === 'play') {
        config.responseType = 'blob';
      }

      const response = await API.post(TTS_API_ENDPOINT, payload, config);

      if (deliveryMode === 'url') {
        const data = response.data;
        if (data.audio_url) {
          setDownloadLink(data.audio_url);
          showSuccess(t('下载链接获取成功'));
        } else {
          showError(t('未获取到下载链接'));
        }
      } else {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        showSuccess(t('音频生成成功'));
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || t('音频生成失败');
      showError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `tts-${Date.now()}.${format}`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 20 }}>
        <Title heading={4} style={{ marginBottom: 4 }}>
          {t('文转语音')}
        </Title>
        <Text type='secondary' size='small'>
          {t('使用 MiniMax TTS 将文本转换为语音')}
        </Text>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
              {t('获取方式')}
            </Text>
            <RadioGroup
              type='button'
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value)}
            >
              <Radio value='play'>{t('直接播放')}</Radio>
              <Radio value='url'>{t('下载链接')}</Radio>
            </RadioGroup>
          </div>

          <div>
            <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
              {t('模型')}
            </Text>
            <Select
              value={model}
              onChange={setModel}
              style={{ width: '100%' }}
              optionList={MODEL_OPTIONS}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
              {t('语音')}
            </Text>
            <Select
              value={voice}
              onChange={setVoice}
              style={{ width: '100%' }}
              optionList={VOICE_OPTIONS}
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
              {t('文本')}
            </Text>
            <TextArea
              value={text}
              onChange={setText}
              placeholder={t('输入要转换为语音的文本...')}
              rows={5}
              autosize
            />
          </div>

          <div>
            <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
              {t('语速')} {speed.toFixed(1)}x
            </Text>
            <Slider
              value={speed}
              onChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
              showBoundary
            />
          </div>

          {deliveryMode === 'play' && (
            <div>
              <Text style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}>
                {t('格式')}
              </Text>
              <Select
                value={format}
                onChange={setFormat}
                style={{ width: '100%' }}
                optionList={FORMAT_OPTIONS}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              theme='solid'
              type='primary'
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!text.trim()}
              icon={deliveryMode === 'url' ? <Link size={16} /> : <Volume2 size={16} />}
              style={{ flex: 1, borderRadius: 8 }}
            >
              {isGenerating ? t('生成中...') : deliveryMode === 'url' ? t('获取下载链接') : t('生成语音')}
            </Button>

            {deliveryMode === 'play' && audioUrl && (
              <Button
                theme='outline'
                onClick={handleDownload}
                icon={<Download size={16} />}
                style={{ borderRadius: 8 }}
              >
                {t('下载')}
              </Button>
            )}
          </div>

          {deliveryMode === 'play' && audioUrl && (
            <div>
              <Text
                style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}
              >
                {t('预览')}
              </Text>
              <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%' }} />
            </div>
          )}

          {deliveryMode === 'url' && downloadLink && (
            <div>
              <Text
                style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}
              >
                {t('下载链接')}
              </Text>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a
                  href={downloadLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--semi-color-link)',
                  }}
                >
                  {downloadLink}
                </a>
                <Button
                  theme='outline'
                  size='small'
                  onClick={() => {
                    navigator.clipboard.writeText(downloadLink);
                    showSuccess(t('链接已复制'));
                  }}
                >
                  {t('复制')}
                </Button>
              </div>
              <Text type='tertiary' size='small' style={{ marginTop: 4, display: 'block' }}>
                {t('链接 24 小时内有效，用户可直接下载，不占用服务器带宽')}
              </Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TextToSpeech;
