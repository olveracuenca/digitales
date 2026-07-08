'use client';

import { useState, useEffect } from 'react';
import { Download, Folder, Music, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import styles from './page.module.css';

interface DownloadState {
  stage: 'idle' | 'fetching' | 'downloading' | 'converting' | 'completed' | 'error';
  percent: number | null;
  title?: string;
  author?: string;
  duration?: number;
  outputPath?: string;
  error?: string;
}

export default function YoutubeDownloader() {
  const [url, setUrl] = useState('');
  const [targetFolder, setTargetFolder] = useState('');
  const [status, setStatus] = useState<DownloadState>({ stage: 'idle', percent: 0 });

  // Load default folder path from API
  useEffect(() => {
    fetch('/api/youtube/download')
      .then((res) => res.json())
      .then((data) => {
        if (data.defaultFolder) {
          setTargetFolder(data.defaultFolder);
        }
      })
      .catch(() => {
        setTargetFolder('C:\\Downloads');
      });
  }, []);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !targetFolder) return;

    setStatus({ stage: 'fetching', percent: 0 });

    try {
      const response = await fetch('/api/youtube/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, targetFolder }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'No se pudo iniciar la descarga.');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No se pudo establecer la transmisión de progreso.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventPart = line.match(/^event: (.+)$/m);
            const eventName = eventPart ? eventPart[1] : '';
            const dataPart = line.match(/^data: (.+)$/m);

            if (dataPart && eventName) {
              const data = JSON.parse(dataPart[1]);

              if (eventName === 'start') {
                setStatus({
                  stage: 'downloading',
                  percent: 0,
                  title: data.title,
                  author: data.author,
                  duration: data.duration,
                  outputPath: data.outputPath,
                });
              } else if (eventName === 'progress') {
                setStatus((prev) => ({
                  ...prev,
                  stage: data.stage,
                  percent: data.percent,
                }));
              } else if (eventName === 'complete') {
                setStatus((prev) => ({
                  ...prev,
                  stage: 'completed',
                  percent: 100,
                  outputPath: data.outputPath,
                  title: data.title,
                }));
              } else if (eventName === 'error') {
                setStatus({
                  stage: 'error',
                  percent: null,
                  error: data.message,
                });
              }
            }
          }
        }
      }
    } catch (err: any) {
      setStatus({
        stage: 'error',
        percent: null,
        error: err.message || 'Ocurrió un error inesperado.',
      });
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isDownloading = ['fetching', 'downloading', 'converting'].includes(status.stage);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} glass animate-fade-in`}>
        <div className={styles.header}>
          <h1 className={`${styles.title} gradient-text`}>YouTube a MP3</h1>
          <p className={styles.subtitle}>
            Descarga audio de YouTube directamente a tu carpeta preferida
          </p>
        </div>

        <form onSubmit={handleDownload} className={styles.formGroup} style={{ gap: '1.25rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Music size={16} className="gradient-text" /> Enlace de YouTube
            </label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isDownloading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Folder size={16} className="gradient-text" /> Carpeta de Destino
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="E.g. C:\Users\Nombre\Music"
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              required
              disabled={isDownloading}
            />
            <span className={styles.helpText}>
              Se guardará el archivo MP3 directamente en esta ubicación de tu computadora.
            </span>
          </div>

          <button type="submit" className={styles.button} disabled={isDownloading || !url || !targetFolder}>
            {isDownloading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Procesando descarga...
              </>
            ) : (
              <>
                <Download size={18} />
                Descargar MP3
              </>
            )}
          </button>
        </form>

        {isDownloading && (
          <div className={styles.progressPanel}>
            <div className={styles.metaInfo}>
              <div className={styles.videoTitle}>{status.title || 'Obteniendo información...'}</div>
              <div className={styles.videoAuthor}>
                {status.author ? `Por ${status.author}` : ''} {status.duration ? `• ${formatDuration(status.duration)}` : ''}
              </div>
            </div>

            <div className={styles.progressInfo}>
              <span>
                {status.stage === 'fetching' && 'Conectando con YouTube...'}
                {status.stage === 'downloading' && 'Descargando audio...'}
                {status.stage === 'converting' && 'Convirtiendo a MP3...'}
              </span>
              <span>{status.percent !== null ? `${status.percent}%` : ''}</span>
            </div>

            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${status.percent ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {status.stage === 'completed' && (
          <div className={styles.successPanel}>
            <div className={styles.successTitle}>
              <CheckCircle2 size={18} /> Descarga Completada
            </div>
            <div>El archivo de audio ha sido descargado y convertido exitosamente.</div>
            <div className={styles.successDetails}>
              <strong>Ruta:</strong> {status.outputPath}
            </div>
          </div>
        )}

        {status.stage === 'error' && (
          <div className={styles.errorPanel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <AlertCircle size={18} /> Error en la descarga
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{status.error}</div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
