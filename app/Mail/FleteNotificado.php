<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FleteNotificado extends Mailable
{
    use Queueable, SerializesModels;

    public $flete;
    public $adicionales;
    public $subjectList;

    /**
     * @param  array  $payload  [
     *     'flete'       => \App\Models\Flete,
     *     'adicionales' => array|\Illuminate\Support\Collection
     * ]
     */
    public function __construct(array $payload)
    {
        $this->flete       = $payload['flete'];
        $this->adicionales = collect($payload['adicionales'] ?? []);

        // 1) Filtrar TODOS los adicionales sin importe (0, null o '')
        $zeros = $this->adicionales
            ->filter(fn($ad) => empty($ad->monto));

        // 2) Construir la lista final para asunto y primer párrafo
        $this->subjectList = collect()
            ->push($this->flete->guiaruta)                          // "124768 - 124765"
            ->push(optional($this->flete->destino)->nombre ?? '')    // "Coquimbo"
            ->merge($zeros->pluck('descripcion'))                    // ["La Cantera","Peñuelas"]
            ->filter()                                               // quita strings vacías
            ->implode(', ');                                         // "124768 - 124765, Coquimbo, La Cantera, Peñuelas"
    }

    public function build()
    {
        return $this
            ->subject("Rendición {$this->subjectList}")
            ->view('emails.fletes.notificado', [
                'flete'       => $this->flete,
                'adicionales' => $this->adicionales,
                'subjectList' => $this->subjectList,
            ]);
    }
}
