export default function CookiesPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Cookies</h1>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos ficheiros de texto armazenados no seu navegador que permitem à plataforma lembrar-se das suas preferências e atividades. Utilizamos cookies para melhorar a sua experiência e garantir a segurança da sua conta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Cookies Essenciais</h3>
          <p>
            Necessários para o funcionamento da plataforma:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code>next-auth.session-token</code>: Mantém a sua sessão autenticada.</li>
            <li><code>privacy_consent</code>: Regista o seu consentimento de privacidade.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Cookies de Análise</h3>
          <p>
            Utilizados para compreender como utiliza a plataforma:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code>_ga</code>: Google Analytics (se ativado).</li>
            <li><code>_session_id</code>: Rastreamento de sessão anónimo.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Cookies de Preferência</h3>
          <p>
            Guardam as suas preferências:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><code>theme</code>: Preferência de tema (claro/escuro).</li>
            <li><code>language</code>: Idioma preferido.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Duração dos Cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Sessão:</strong> Eliminados quando fecha o navegador.</li>
            <li><strong>Persistentes:</strong> Mantidos até 1 ano ou até que os elimine manualmente.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Controlo de Cookies</h2>
          <p>
            Pode controlar os cookies através das definições do seu navegador:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Chrome:</strong> Definições → Privacidade e segurança → Cookies e dados de sites.</li>
            <li><strong>Firefox:</strong> Preferências → Privacidade e Segurança → Cookies e dados de sites.</li>
            <li><strong>Safari:</strong> Preferências → Privacidade → Cookies e dados de sites.</li>
          </ul>
          <p className="mt-4">
            <strong>Nota:</strong> Desativar cookies essenciais pode afetar o funcionamento da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies de Terceiros</h2>
          <p>
            Não utilizamos cookies de terceiros sem o seu consentimento explícito. Se integrarmos serviços de terceiros (ex: Google Analytics), será solicitado o seu consentimento.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contacto</h2>
          <p>
            Para questões sobre cookies, contacte:
          </p>
          <p className="mt-2">
            <strong>Global Safety Angola</strong><br />
            Email: privacy@globalsafety.ao<br />
            Telefone: +244 923 456 789
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-600 mt-8">
            Última atualização: {new Date().toLocaleDateString("pt-AO")}
          </p>
        </section>
      </div>
    </div>
  );
}
