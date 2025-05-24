export const dammyMemos = [
  {
    id: '1',
    title: 'React useEffect フック',
    content: 'useEffectの第二引数の依存配列について理解を深める必要がある',
    type: 'text',
    tags: ['React', 'Hooks', '学習'],
    isPinned: true,
    aiExplanation:
      'useEffectフックは、関数コンポーネント内で副作用を実行するためのReactフックです。第二引数の依存配列は、副作用が実行される条件を制御します。空の配列を渡すと、コンポーネントのマウント時とアンマウント時にのみ実行されます。特定の値を含む配列を渡すと、それらの値が変更されたときにのみ実行されます。依存配列を省略すると、コンポーネントが再レンダリングされるたびに実行されます。',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '2',
    title: 'TypeScriptのジェネリクス',
    content: 'ジェネリクスの共変性と反変性について調査する',
    type: 'question',
    tags: ['TypeScript', 'ジェネリクス', '型システム'],
    aiExplanation:
      'TypeScriptのジェネリクスにおける共変性と反変性は、型の互換性に関する概念です。共変性は、より具体的な型をより抽象的な型として扱えることを意味します。反変性は、より抽象的な型をより具体的な型として扱えることを意味します。これらの概念は、特に関数型や配列型などの複合型を扱う際に重要になります。',
    createdAt: new Date('2023-04-02'),
    updatedAt: new Date('2023-04-02'),
  },
  {
    id: '3',
    title: '非同期処理のデバッグ方法',
    content: `
  async function fetchData() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
        `,
    type: 'code',
    tags: ['JavaScript', '非同期', 'デバッグ'],
    aiExplanation:
      'このコードは、APIからデータを非同期で取得する関数です。fetch APIを使用してHTTPリクエストを送信し、レスポンスをJSONとしてパースしています。try-catch文を使用してエラーハンドリングを行い、エラーが発生した場合はコンソールにエラーメッセージを出力し、エラーを再スローしています。非同期処理のデバッグには、console.logを適切な場所に配置する、ブレークポイントを設定する、async/awaitを使用して読みやすくするなどの方法があります。',
    createdAt: new Date('2023-04-03'),
    updatedAt: new Date('2023-04-03'),
  },
  {
    id: '4',
    title: 'CSSグリッドレイアウト',
    content: 'グリッドレイアウトの基本的な使い方と、フレックスボックスとの違いについて調べる',
    type: 'text',
    tags: ['CSS', 'レイアウト', 'グリッド', 'Tailwind', 'カラム'],
    aiExplanation:
      'CSSグリッドレイアウトは、Webページの2次元レイアウトを作成するための強力なツールです。display: grid; を使用して要素をグリッドコンテナにし、grid-template-columns や grid-template-rows でグリッドの構造を定義します。フレックスボックスが1次元のレイアウト（行または列）に最適なのに対し、グリッドは行と列の両方を同時に制御できる2次元レイアウトに適しています。',
    createdAt: new Date('2023-04-04'),
    updatedAt: new Date('2023-04-04'),
  },
]
