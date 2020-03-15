// this script generate interface Player for `player.ts`

const interfaces = `addListener(event: string | symbol, listener: (...args: any[]) => void): this;
on(event: string | symbol, listener: (...args: any[]) => void): this;
once(event: string | symbol, listener: (...args: any[]) => void): this;
removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
off(event: string | symbol, listener: (...args: any[]) => void): this;
emit(event: string | symbol, ...args: any[]): boolean;
prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;`;
const data = [
  {
    event: 'play',
    doc: 'playback started',
  },
  {
    event: 'frame',
    args: 'currentFrameNumber: number',
    doc: 'frame played',
  },
  {
    event: 'pause',
    doc: 'playback paused',
  },
  {
    event: 'stop',
    doc: 'playback stopped',
  },
  {
    event: 'end',
    doc: 'playback ended (for APNG with finite count of plays)',
  },
];
// eslint-disable-next-line no-console
console.log(`
interface Player{${interfaces
  .split('\n')
  .flatMap(method => [
    '\n',
    ...data.map(
      x => `/**
 * ${x.doc}
 */
${method
  .replace('event: string | symbol', `event: '${x.event}'`)
  .replace('...args: any[]', x.args || '')}`,
    ),
  ])
  .join('\n')
  .split('\n')
  .map(x => `  ${x}`)
  .join('\n')}
}
`);
