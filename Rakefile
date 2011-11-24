require 'bundler/setup'
require 'smart_asset'
require 'fileutils'
require 'cloudfiles'
require 'digest/md5'

task :default => [:all]

task :all => [:css, :js] do
end

task :js do
  puts "compressing js"
  SmartAsset.load_config Dir.pwd, 'assets.yml'
  SmartAsset.compress 'javascripts'
  Dir["#{Dir.pwd}/theme/javascripts/temp/*.js"].each do |filename|
    target_filename = filename.sub(/\/temp\/.*_/, '/')
    puts "Moving to #{target_filename}"
    FileUtils.move filename, filename.sub(/\/temp\/.*_/, '/')
  end
  puts "Removing temp folder"
  Dir.delete "#{Dir.pwd}/theme/javascripts/temp"
  abort "Javascript compression failed!" if File.size("#{Dir.pwd}/theme/javascripts/theme.js") == 0
end

task :css do
  output_css = "#{Dir.pwd}/theme/stylesheets/theme.css"
  File.delete(output_css) if File::exists?(output_css)

  puts "compressing css"
  puts `compass compile`
  abort "CSS compression failed!" unless $?.success?
end

task :deploy => [:build_zip, :upload]

task :sample_index do
  puts "building samples/index.htm"

  hg_tip = `hg tip`.strip
  hg_version = hg_tip.match("^changeset:.*:(.*)$")[1]

  file = File.new("samples/index.htm", "w+")
  file.puts "<!DOCTYPE HTML><html><body><h1>InSTEDD Platform Common</h1><pre>#{hg_tip}</pre>"
  file.puts "<a href=\"http://code.google.com/p/instedd-platform-common/source/detail?r=#{hg_version}\">source on google code</a>"
  file.puts "<ul>"

  Dir["#{Dir.pwd}/samples/**/*.htm"].sort.each do |filename|
    filename.sub!("#{Dir.pwd}/samples/", "")
    next if filename == "index.htm"
    file.puts "<li><a href=\"#{filename}\">#{filename}</a>"
  end

  file.puts "</ul></body></html>"
  file.close
end

task :build_zip => [:all, :sample_index] do
  puts "building theme/theme.zip"
  `zip -r theme/theme.zip theme/ -x theme/theme.zip *sass* *.DS_Store *javascripts/source/*`
end

task :upload  do
  files = Dir['{{samples,theme}/**/*,index.htm}']
  files.reject! { |x| !File.file? x }
  files.reject! { |x| x.end_with? '/.DS_Store' }
  files.reject! { |x| x.start_with? 'theme/sass/' }
  files.reject! { |x| x.start_with? 'theme/javascripts/source' }

  cf = CloudFiles::Connection.new :username => ENV['CLOUDFILES_USER'], :api_key => ENV['CLOUDFILES_API_KEY']
  ['platform-common', 'platform-common-staging'].each do |bucket_name|
    puts "Uploading changes to bucket '#{bucket_name}'"
    bucket = cf.container bucket_name
    $stored_files = bucket.objects_detail

    def has_to_update? file
      stored = $stored_files[file]
      if stored
        if File.size(file) != stored[:bytes].to_i || Digest::MD5.file(file).to_s != stored[:hash]
          puts "Updating file #{file}"
          true
        else
          false
        end
      else
        puts "Uploading new file #{file}"
        true
      end
    end

    files.each do |file|
      if has_to_update? file
        obj = bucket.create_object file
        headers = {}
        headers['Access-Control-Allow-Origin'] = '*' if file.start_with? 'theme/fonts/'
        obj.write open(file), headers
      end
    end

    ($stored_files.keys - files).each do |missing|
      next if File.directory? missing
      puts "Deleting file #{missing}"
      bucket.delete_object missing
    end

    begin
      puts "Invalidating cache"
      bucket.purge_from_cdn
    rescue
      puts "Failed to invalidate CDN (probably last invalidation was less than an hour ago)"
    end
  end
end
