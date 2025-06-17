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

    public function __construct(array $payload)
    {
        $this->flete       = $payload['flete'];
        $this->adicionales = $payload['adicionales'];
    }

    public function build()
    {
        return $this
            ->subject("Detalles de tu Flete #{$this->flete->id}")
            ->markdown('emails.fletes.notificado');
    }
}
