/*
Copyright (C) 2023-2026 QuantumNous

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
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Volume2, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { generateSpeech, TTSRequest } from './api'

// MiniMax TTS voice IDs - you may need to update this list from MiniMax documentation
const VOICE_OPTIONS = [
  { value: 'male-qn-qingse', label: '清澈少女' },
  { value: 'male-qn-qingqiu', label: '清脆青年' },
  { value: 'male-qn-chengbao', label: '成熟沉稳' },
  { value: 'female-tianmei', label: '甜美少女' },
  { value: 'male-yujie', label: '幽默诙谐' },
  { value: 'female-xianyu', label: '温柔贤淑' },
]

const MODEL_OPTIONS = [
  { value: 'speech-01-hd', label: 'speech-01-hd (高清)' },
  { value: 'speech-01-turbo', label: 'speech-01-turbo (快速)' },
  { value: 'speech-02-hd', label: 'speech-02-hd (高清)' },
  { value: 'speech-02-turbo', label: 'speech-02-turbo (快速)' },
]

const FORMAT_OPTIONS = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
  { value: 'flac', label: 'FLAC' },
]

export function TextToSpeech() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(VOICE_OPTIONS[0].value)
  const [model, setModel] = useState(MODEL_OPTIONS[0].value)
  const [speed, setSpeed] = useState([1.0])
  const [format, setFormat] = useState('mp3')
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error(t('Please enter text to convert'))
      return
    }

    setIsGenerating(true)
    setAudioUrl(null)

    try {
      const payload: TTSRequest = {
        model,
        input: text,
        voice,
        response_format: format,
        speed: speed[0],
      }

      const blob = await generateSpeech(payload)
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)

      toast.success(t('Audio generated successfully'))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err?.response?.data?.message || err?.message || t('Failed to generate audio'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `tts-${Date.now()}.${format}`
    a.click()
  }

  return (
    <div className='mx-auto max-w-2xl space-y-6 p-6'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold'>{t('Text to Speech')}</h1>
        <p className='text-muted-foreground text-sm'>
          {t('Convert text to speech using MiniMax TTS')}
        </p>
      </div>

      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label>{t('Model')}</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>{t('Voice')}</Label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label>{t('Text')}</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('Enter text to convert to speech...')}
            rows={6}
            className='resize-none'
          />
        </div>

        <div className='space-y-2'>
          <Label>
            {t('Speed')} {speed[0].toFixed(1)}x
          </Label>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={0.5}
            max={2.0}
            step={0.1}
          />
        </div>

        <div className='space-y-2'>
          <Label>{t('Format')}</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className='flex-1'
          >
            {isGenerating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {t('Generating...')}
              </>
            ) : (
              <>
                <Volume2 className='mr-2 h-4 w-4' />
                {t('Generate')}
              </>
            )}
          </Button>

          {audioUrl && (
            <Button onClick={handleDownload} variant='outline'>
              <Download className='mr-2 h-4 w-4' />
              {t('Download')}
            </Button>
          )}
        </div>

        {audioUrl && (
          <div className='space-y-2'>
            <Label>{t('Preview')}</Label>
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className='w-full'
            />
          </div>
        )}
      </div>
    </div>
  )
}
