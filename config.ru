use Rack::Static,
  :urls => ["/images", "/js", "/css"],
  :root => "public"

map "/ida" do
    run lambda { |env|
      [
        200,
        {
          'Content-Type'  => 'text/html',
          'Cache-Control' => 'public, max-age=86400'
        },
        File.open('public/ida.html', File::RDONLY)
      ]
    }
end

map "/vuelta" do
    run lambda { |env|
      [
        200,
        {
          'Content-Type'  => 'text/html',
          'Cache-Control' => 'public, max-age=86400'
        },
        File.open('public/vuelta.html', File::RDONLY)
      ]
    }
end