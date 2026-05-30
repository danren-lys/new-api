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
} from '@douyinfe/semi-ui';
import { Volume2, Download, Loader2 } from 'lucide-react';
import { API, showError, showSuccess } from '../../helpers';

const { Title, Text } = Typography;

const VOICE_OPTIONS = [
  { value: 'male-qn-qingse', label: '清澈少女' },
  { value: 'male-qn-qingqiu', label: '清脆青年' },
  { value: 'male-qn-chengbao', label: '成熟沉稳' },
  { value: 'female-tianmei', label: '甜美少女' },
  { value: 'male-yujie', label: '幽默诙谐' },
  { value: 'female-xianyu', label: '温柔贤淑' },
];

const MODEL_OPTIONS = [
  { value: 'speech-01-hd', label: 'speech-01-hd (高清)' },
  { value: 'speech-01-turbo', label: 'speech-01-turbo (快速)' },
  { value: 'speech-02-hd', label: 'speech-02-hd (高清)' },
  { value: 'speech-02-turbo', label: 'speech-02-turbo (快速)' },
];

const FORMAT_OPTIONS = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'flac', label: 'FLAC' },
];

const TTS_API_ENDPOINT = '/v1/audio/speech';

function TextToSpeech() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].value);
  const [model, setModel] = useState(MODEL_OPTIONS[0].value);
  const [speed, setSpeed] = useState(1.0);
  const [format, setFormat] = useState('mp3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      showError(t('请输入要转换的文本'));
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const payload = {
        model,
        input: text,
        voice,
        response_format: format,
        speed,
      };

      const response = await API.post(TTS_API_ENDPOINT, payload, {
        responseType: 'blob',
        skipErrorHandler: true,
      });

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      showSuccess(t('音频生成成功'));
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

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              theme='solid'
              type='primary'
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!text.trim()}
              icon={<Volume2 size={16} />}
              style={{ flex: 1, borderRadius: 8 }}
            >
              {isGenerating ? t('生成中...') : t('生成语音')}
            </Button>

            {audioUrl && (
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

          {audioUrl && (
            <div>
              <Text
                style={{ marginBottom: 6, display: 'block', fontWeight: 500 }}
              >
                {t('预览')}
              </Text>
              <audio ref={audioRef} src={audioUrl} controls style={{ width: '100%' }} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TextToSpeech;
